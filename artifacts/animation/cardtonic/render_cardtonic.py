"""Render a Cardtonic P2P walkthrough in the saved Fundall Type A style."""
from pathlib import Path
import math
import subprocess
from PIL import Image, ImageDraw, ImageFilter, ImageChops

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
ASSETS = ROOT / 'images' / 'Cardtonic'
OUT = ROOT / 'videos' / 'cardtonic'
FF = Path(r'C:\Users\Excellentm\AppData\Local\Temp\codex-animation-tools\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe')
W, H, FPS, DURATION = 1800, 542, 30, 14.0
SHELL_FILE = 'Mockup-6.png'
# Use the product's own phone mockup as the persistent device. The exported
# screen captures already contain a phone frame and transparent outer shadow;
# crop to their display area before swapping them into this one shared shell.
SHELL_SOURCE_SIZE = (326, 648)
SCREEN = (27, 20, 299, 620)
DW, DH = SHELL_SOURCE_SIZE
SW, SH = SCREEN[2] - SCREEN[0], SCREEN[3] - SCREEN[1]
PAPER = (244, 248, 250)
NAVY = '#002444'
CYAN = '#00CDDE'

FILES = [
    'Mockup-6.png', 'Mockup-7.png', 'Mockup.png', 'Mockup-2.png',
    'Mockup-1.png', 'Mockup-4.png', 'Mockup-5.png', 'Mockup-6.png',
]
STATES = [(0.0, 'home'), (1.65, 'search'), (3.25, 'verify'),
          (5.15, 'amount'), (7.1, 'review'), (9.05, 'pin'),
          (10.85, 'success'), (12.05, 'home')]
NAMES = [name for _, name in STATES]


def ease(value):
    value = max(0., min(1., value))
    return value * value * value * (value * (value * 6 - 15) + 10)


def make_shell():
    im = Image.open(ASSETS / SHELL_FILE).convert('RGBA')
    draw = ImageDraw.Draw(im)
    # Strengthen the existing mockup's device edge so it reads as a handset
    # against pale screens at the smaller Work-card playback size.
    draw.rounded_rectangle((19, 11, 307, 630), radius=27, fill='#111923', outline='#697581', width=2)
    draw.rounded_rectangle((25, 17, 301, 623), radius=21, outline='#05090e', width=2)
    draw.rounded_rectangle((139, 13, 187, 16), radius=2, fill='#05090e')
    draw.ellipse((195, 12, 199, 16), fill='#05090e')
    aperture = Image.new('L', im.size, 0)
    ImageDraw.Draw(aperture).rounded_rectangle(
        (SCREEN[0], SCREEN[1], SCREEN[2]-1, SCREEN[3]-1), radius=18, fill=255)
    im.putalpha(ImageChops.multiply(im.getchannel('A'), ImageChops.invert(aperture)))
    return im


SHELL = make_shell()
MASK = Image.new('L', (SW, SH), 0)
ImageDraw.Draw(MASK).rounded_rectangle((0, 0, SW-1, SH-1), radius=18, fill=255)


def load_screen(filename):
    raw = Image.open(ASSETS / filename).convert('RGBA')
    # Asset exports vary between 326×648 and 448×912, but both contain the
    # same UI inside a complete handset. Remove that outer handset and shadow
    # so they cannot appear nested inside the persistent mockup.
    if raw.width >= 400:
        bounds = (24, 20, 424, 886)
    else:
        bounds = (27, 20, 299, 620)
    src = raw.crop(bounds).resize((SW, SH), Image.Resampling.LANCZOS)
    src.putalpha(ImageChops.multiply(src.getchannel('A'), MASK))
    return src


SCREENS = {name: load_screen(filename) for name, filename in zip(NAMES, FILES)}


def background():
    im = Image.new('RGB', (W, H), PAPER)
    # Soft, static cyan-blue wash, using the Cardtonic UI palette, anchors the otherwise quiet field.
    light = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(light)
    d.ellipse((1080, 40, 1510, 500), fill=(0, 205, 222, 22))
    light = light.filter(ImageFilter.GaussianBlur(52))
    im = Image.alpha_composite(im.convert('RGBA'), light).convert('RGB')
    # A restrained floor shadow anchors the phone without adding a second device or UI.
    shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).ellipse((744, 494, 1056, 523), fill=(0, 36, 68, 28))
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))
    return Image.alpha_composite(im.convert('RGBA'), shadow).convert('RGB')


BG = background()


def tap(im, name, t):
    targets = {
        'home': (.60, .74), 'search': (.27, .48), 'verify': (.76, .82),
        'amount': (.50, .84), 'review': (.50, .83),
    }
    if name not in targets:
        return im
    start = next((begin for begin, target in STATES if target == name), 0.)
    p = (t - (start + 1.03)) / .54
    if not 0 <= p <= 1:
        return im
    scale = .56
    x = round((W-DW*scale)/2 + scale*(SCREEN[0] + SW*targets[name][0]))
    y = round((H-DH*scale)/2 + scale*(SCREEN[1] + SH*targets[name][1]))
    radius = round((8 + 27 * ease(p)) * scale)
    alpha = round(150 * (1 - ease(p)))
    overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.ellipse((x-radius, y-radius, x+radius, y+radius), fill=(0, 205, 222, 28), outline=(0, 112, 150, alpha), width=3)
    d.ellipse((x-4, y-4, x+4, y+4), fill=(0, 112, 150, min(190, alpha+30)))
    im = im.convert('RGBA')
    im.alpha_composite(overlay)
    return im.convert('RGB')


def frame(t):
    current = max(i for i, (start, _) in enumerate(STATES) if t >= start)
    start, name = STATES[current]
    screen = SCREENS[name]
    if current > 0 and t < start + .4:
        previous_name = STATES[current-1][1]
        p = ease((t-start)/.4)
        screen = Image.blend(SCREENS[previous_name], screen, p)
    # The handset never moves or duplicates. Only its display content changes,
    # keeping every step inside the same Cardtonic device frame.
    device = SHELL.copy()
    device.alpha_composite(screen, (SCREEN[0], SCREEN[1]))
    scale = .81
    shown = device.resize((round(DW*scale), round(DH*scale)), Image.Resampling.LANCZOS)
    canvas = BG.copy().convert('RGBA')
    canvas.alpha_composite(shown, ((W-shown.width)//2, (H-shown.height)//2))
    canvas = canvas.convert('RGB')
    if current < len(STATES)-1:
        next_start = STATES[current+1][0]
        canvas = tap(canvas, name, t) if next_start-.54 <= t < next_start else canvas
    return canvas


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    poster = frame(0)
    poster.save(OUT / 'transfer-type-a-poster.png')
    times = [0, 2.2, 4.5, 6.7, 8.7, 10.1, 11.5, 13.2]
    sheet = Image.new('RGB', (1200, 4*205), '#ffffff')
    d = ImageDraw.Draw(sheet)
    for i, t in enumerate(times):
        still = frame(t).resize((600, 181), Image.Resampling.LANCZOS)
        x, y = (i % 2)*600, (i // 2)*205
        sheet.paste(still, (x, y+24))
        d.text((x+12, y+4), f'Cardtonic · {t:.2f}s · {NAMES[max(i for i,(s,_) in enumerate(STATES) if t>=s)]}', fill='#002444')
    sheet.save(HERE / 'transfer-type-a-storyboard.jpg', quality=94)
    output = OUT / 'transfer-type-a.mp4'
    process = subprocess.Popen([str(FF), '-y', '-hide_banner', '-loglevel', 'error',
        '-f', 'rawvideo', '-vcodec', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}',
        '-r', str(FPS), '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'fast',
        '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(output)], stdin=subprocess.PIPE)
    try:
        for n in range(round(DURATION*FPS)):
            process.stdin.write(frame(n/FPS).tobytes())
            if n % (FPS*2) == 0:
                print(f'{n/FPS:.0f}/{DURATION:.0f}s rendered', flush=True)
    finally:
        process.stdin.close()
    if process.wait():
        raise RuntimeError('FFmpeg render failed')
    subprocess.run([str(FF), '-hide_banner', '-loglevel', 'error', '-i', str(output), '-f', 'null', '-'], check=True)
    if ImageChops.difference(frame(0), frame(DURATION-1/FPS)).getbbox() is not None:
        raise RuntimeError('Loop endpoint mismatch')
    print(f'Saved and decoded {output.name}: {output.stat().st_size:,} bytes')


if __name__ == '__main__':
    main()
