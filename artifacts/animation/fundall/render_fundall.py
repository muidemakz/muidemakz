"""Two Fundall motion studies; original screenshots and banner remain untouched."""
from pathlib import Path
from functools import lru_cache
import argparse
import json
import math
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
ASSETS = ROOT / 'images' / 'fundall'
FF = Path(r'C:\Users\Excellentm\AppData\Local\Temp\codex-animation-tools\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe')
W, H, FPS = 1800, 542, 30
PW, PH = 420, 880
BOX = (23, 24, 397, 852)
SW, SH = BOX[2] - BOX[0], BOX[3] - BOX[1]
GREEN = '#00663a'
ORANGE = '#ff8c24'
FONT = Path(r'C:\Windows\Fonts\arial.ttf')
BOLD = Path(r'C:\Windows\Fonts\arialbd.ttf')
COVER = Image.open(ASSETS / 'cover-phones.png').convert('RGB')
PAPER = COVER.getpixel((20, 20))
LEFT = np.array([(715, 149), (837, 158), (875, 449), (750, 464)], dtype=float)
RIGHT = np.array([(956, 72), (1077, 91), (968, 390), (846, 359)], dtype=float)
CENTER = np.array([(785, 30), (1015, 30), (1015, 512), (785, 512)], dtype=float)


def ease(x):
    x = max(0., min(1., x))
    return x * x * x * (x * (x * 6 - 15) + 10)


def tween(a, b, p):
    return a + (b - a) * ease(p)


@lru_cache(None)
def font(size, bold=False):
    return ImageFont.truetype(str(BOLD if bold else FONT), size)


def centered(im, y, words, size=24, color=GREEN, bold=False):
    d = ImageDraw.Draw(im)
    f = font(size, bold)
    d.text(((im.width - d.textlength(words, font=f)) / 2, y), words, font=f, fill=color)


def coefficients(dst, src):
    matrix, rhs = [], []
    for (x, y), (u, v) in zip(dst, src):
        matrix += [[x, y, 1, 0, 0, 0, -u*x, -u*y], [0, 0, 0, x, y, 1, -v*x, -v*y]]
        rhs += [u, v]
    return tuple(np.linalg.solve(np.array(matrix), np.array(rhs)))


def warp(im, quad):
    # Bound the transform to the device rather than resampling an entire frame.
    x = math.floor(min(p[0] for p in quad)) - 5
    y = math.floor(min(p[1] for p in quad)) - 5
    right = math.ceil(max(p[0] for p in quad)) + 5
    bottom = math.ceil(max(p[1] for p in quad)) + 5
    local = [(p[0]-x, p[1]-y) for p in quad]
    src = [(0, 0), (im.width, 0), (im.width, im.height), (0, im.height)]
    transformed = im.transform((right-x, bottom-y), Image.Transform.PERSPECTIVE,
                               coefficients(local, src), Image.Resampling.BICUBIC)
    return transformed, (x, y)


def load_screen(filename):
    im = Image.open(ASSETS / filename).convert('RGB')
    return im.resize((SW, SH), Image.Resampling.LANCZOS)


LOGIN = load_screen('sign-in.png')
INTRO = load_screen('salary-advance-intro.png')
ELIGIBILITY = load_screen('loan-form-eligibility.png')
EMPLOYER = load_screen('loan-form-employer.png')
SUCCESS = load_screen('loan-success.png')

# Recover the exact home-screen content visible in the supplied two-phone banner,
# including its navigation. The separate "home-after" asset is a different version.
BIG_COVER = Image.open(ASSETS / 'cover.png').convert('RGB')
ratio = BIG_COVER.width / COVER.width
home_corners = [(960*ratio, 75*ratio), (1075*ratio, 94*ratio),
                (963*ratio, 382*ratio), (850*ratio, 350*ratio)]
HOME = BIG_COVER.transform((SW, SH), Image.Transform.PERSPECTIVE,
    coefficients([(0, 0), (SW, 0), (SW, SH), (0, SH)], home_corners), Image.Resampling.BICUBIC)

BACKGROUND = Image.new('RGB', (W, H), PAPER)
# The original Fundall mark sits behind the right phone. Retain its existing
# artwork while masking the phone out of this background-only layer.
mark = COVER.crop((968, 323, 1114, 447))
BACKGROUND.paste(mark, (968, 323))
# A small edge of the phone in the crop is removed using the backdrop colour.
bd = ImageDraw.Draw(BACKGROUND)
bd.polygon([(968, 323), (984, 323), (972, 365), (968, 369)], fill=PAPER)


@lru_cache(None)
def shell():
    im = Image.new('RGBA', (PW, PH))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, PW-1, PH-1), radius=66, fill='#767d82')
    d.rounded_rectangle((2, 2, PW-3, PH-3), radius=65, fill='#d4d8db')
    d.rounded_rectangle((5, 5, PW-6, PH-6), radius=63, fill='#8b9298')
    d.rounded_rectangle((8, 8, PW-9, PH-9), radius=61, fill='#202328')
    d.rounded_rectangle((12, 12, PW-13, PH-13), radius=57, fill='#08090b')
    # Fine metallic highlights avoid a thick cartoon bezel.
    d.arc((1, 1, 131, 131), 184, 268, fill='#eef0f1', width=2)
    d.arc((PW-132, 1, PW-2, 131), 272, 358, fill='#eef0f1', width=2)
    return im


MASK = Image.new('L', (SW, SH))
ImageDraw.Draw(MASK).rounded_rectangle((0, 0, SW-1, SH-1), radius=45, fill=255)


def phone(screen):
    im = shell().copy()
    im.paste(screen.convert('RGBA'), BOX[:2], MASK)
    d = ImageDraw.Draw(im)
    # One consistent physical device across all original screen exports.
    d.rounded_rectangle((103, 17, 317, 53), radius=23, fill='#030405')
    d.rectangle((103, 17, 317, 29), fill='#030405')
    d.rounded_rectangle((153, 25, 265, 30), radius=3, fill='#20242a')
    d.ellipse((127, 25, 139, 37), fill='#111725')
    d.ellipse((130, 28, 136, 34), fill='#182841')
    d.rounded_rectangle((150, 838, 270, 843), radius=3, fill='#171b19')
    return im


STATIC = {name: phone(im) for name, im in [('login', LOGIN), ('home', HOME),
    ('intro', INTRO), ('eligibility', ELIGIBILITY), ('employer', EMPLOYER), ('success', SUCCESS)]}


def place(im, layer, quad):
    warped, xy = warp(layer, quad)
    im.paste(warped, xy, warped)


def tap(screen, xy, age):
    im = screen.copy().convert('RGBA')
    if 0 <= age <= .6:
        overlay = Image.new('RGBA', im.size)
        d = ImageDraw.Draw(overlay)
        p = age/.6
        r = 10 + 24*ease(p)
        a = round(210*(1-p))
        x, y = xy
        d.ellipse((x-r, y-r, x+r, y+r), outline=(0, 102, 58, a), width=3)
        d.ellipse((x-4, y-4, x+4, y+4), fill=(0, 102, 58, a))
        im = Image.alpha_composite(im, overlay)
    return im.convert('RGB')


def face_icon(d, x, y, size=64, color=GREEN, scan=None, success=False):
    k = size/64
    def pt(a, b): return (x+a*k, y+b*k)
    width = max(2, round(3*k))
    for points in [[(0,17),(0,0),(17,0)], [(47,0),(64,0),(64,17)],
                   [(0,47),(0,64),(17,64)], [(47,64),(64,64),(64,47)]]:
        d.line([pt(*p) for p in points], fill=color, width=width, joint='curve')
    if success:
        d.line([pt(15,32), pt(28,45), pt(51,20)], fill=color, width=width+1, joint='curve')
    else:
        d.line([pt(18,23),pt(18,29)], fill=color, width=width)
        d.line([pt(46,23),pt(46,29)], fill=color, width=width)
        d.line([pt(33,25),pt(33,37),pt(28,37)], fill=color, width=width)
        d.arc((*pt(17,31), *pt(48,47)), 20, 160, fill=color, width=width)
        if scan is not None:
            yy = y + (12 + 38*scan)*k
            d.line((x+8*k, yy, x+56*k, yy), fill='#b6ddcb', width=2)


def face_state(t):
    im = LOGIN.copy().convert('RGBA')
    shade = Image.new('RGBA', im.size, (0, 20, 12, 42))
    im = Image.alpha_composite(im, shade)
    card = Image.new('RGBA', im.size)
    d = ImageDraw.Draw(card)
    x, y = 48, 311
    d.rounded_rectangle((x, y, SW-x, y+222), radius=21, fill=(255,255,255,250), outline='#e2e6e4', width=1)
    success = t >= 4.75
    face_icon(d, (SW-64)/2, y+30, success=success,
              scan=None if success else (math.sin((t-3.25)*math.pi*1.5)+1)/2)
    centered(card, y+116, 'Log in with Face ID', 22, '#163327', True)
    centered(card, y+157, 'Verified' if success else 'Looking for you…', 19, '#61736a')
    return Image.alpha_composite(im, card).convert('RGB')


LOGO_CROP = Image.open(ASSETS / 'sign-in.png').convert('RGB').crop((72, 110, 270, 211))


def welcome(t, loading=False):
    im = Image.new('RGB', (SW, SH), '#f9fcfa')
    logo = LOGO_CROP.resize((108, 55), Image.Resampling.LANCZOS)
    # Mask the original logo's warm backdrop, preserving its actual artwork.
    arr = np.array(logo)
    lm = Image.fromarray(np.where((arr[:,:,0] > 205) & (arr[:,:,1] > 190) & (arr[:,:,2] > 175), 0, 255).astype('uint8'))
    im.paste(logo, ((SW-108)//2, 132), lm)
    d = ImageDraw.Draw(im)
    if loading:
        angle = (t-5.4)*350
        d.arc((SW/2-19, 360, SW/2+19, 398), 0, 360, fill='#dcebe3', width=3)
        d.arc((SW/2-19, 360, SW/2+19, 398), angle, angle+95, fill=GREEN, width=3)
        centered(im, 429, 'Signing you in', 22, '#547062')
    else:
        d.ellipse((SW/2-28, 345, SW/2+28, 401), fill='#e4f3eb')
        d.line((SW/2-13,373,SW/2-3,383,SW/2+15,363), fill=GREEN, width=3, joint='curve')
        centered(im, 432, 'Welcome back', 30, GREEN, True)
        centered(im, 479, "You're all set.", 20, '#547062')
    return im


def slide(a, b, p, direction=1):
    p = ease(p)
    im = Image.new('RGB', (SW, SH), 'white')
    offset = round(SW*p)*direction
    im.paste(a, (-offset, 0))
    im.paste(b, ((SW-offset) if direction==1 else (-SW-offset), 0))
    return im


def b_frame(t):
    im = BACKGROUND.copy()
    if t < 2.35:
        p = (t-.75)/1.6
        place(im, STATIC['home'], tween(RIGHT, CENTER, p))
        place(im, STATIC['login'], tween(LEFT, CENTER, p))
    elif t < 9.35:
        if t < 3.2:
            screen = tap(LOGIN, (SW*.85, SH*.808), t-2.68)
        elif t < 5.45:
            overlay = face_state(t)
            screen = Image.blend(LOGIN, overlay, ease((t-3.2)/.22))
        elif t < 6.4:
            screen = welcome(t, loading=True)
        elif t < 7.45:
            screen = welcome(t)
        elif t < 7.95:
            screen = slide(welcome(t), HOME, (t-7.45)/.5)
        else:
            screen = HOME
        place(im, phone(screen), CENTER)
    elif t < 10.95:
        p = (t-9.35)/1.6
        place(im, STATIC['home'], tween(CENTER, RIGHT, p))
        # The returning left device restores its original login screen as the
        # physical pair separates; the right device keeps the home screen.
        screen = Image.blend(HOME, LOGIN, ease((t-9.45)/.42))
        place(im, phone(screen), tween(CENTER, LEFT, p))
    else:
        place(im, STATIC['home'], RIGHT)
        place(im, STATIC['login'], LEFT)
    return im


A_STATES = [(0., 'home'), (1.9, 'intro'), (4.05, 'eligibility'),
            (6.25, 'employer'), (8.4, 'success'), (11.35, 'home')]
SCREENS = {'home': HOME, 'intro': INTRO, 'eligibility': ELIGIBILITY,
           'employer': EMPLOYER, 'success': SUCCESS}


def a_frame(t):
    im = BACKGROUND.copy()
    current = 0
    for n, (start, name) in enumerate(A_STATES):
        if t >= start: current = n
    start, name = A_STATES[current]
    screen = SCREENS[name]
    if current and t < start+.42:
        previous = SCREENS[A_STATES[current-1][1]]
        screen = slide(previous, screen, (t-start)/.42)
    # A small intent marker precedes each source-screen transition.
    next_index = current + 1
    if next_index < len(A_STATES):
        next_start = A_STATES[next_index][0]
        if next_start-.55 <= t < next_start:
            target = {'home':(.63,.67), 'intro':(.5,.89),
                      'eligibility':(.5,.82), 'employer':(.5,.82),
                      'success':(.5,.82)}[name]
            screen = tap(screen, (SW*target[0], SH*target[1]), t-(next_start-.55))
    place(im, phone(screen), CENTER)
    return im


VARIANTS = {'A': ('fundall-A-borrowing-v1', a_frame, 13.),
            'B': ('fundall-B-face-id-v2', b_frame, 12.5)}


def stills(keys=None):
    selected = keys or VARIANTS.keys()
    for key in selected:
        name, fn, duration = VARIANTS[key]
        times = [0, 2.55, 3.9, 5.8, 6.8, 8.5, 10, 12] if key=='B' else [0,2.5,4.7,6.9,9.2,12]
        sheet = Image.new('RGB', (1200, math.ceil(len(times)/2)*205), 'white')
        d = ImageDraw.Draw(sheet)
        for i, t in enumerate(times):
            frame = fn(t)
            frame.save(HERE/f'{name}-{t:.2f}s.png')
            thumb = frame.resize((600,181), Image.Resampling.LANCZOS)
            x, y = (i%2)*600, (i//2)*205
            sheet.paste(thumb, (x,y+24))
            d.text((x+12,y+4), f'{key} / {t:.2f}s', fill='#345344', font=font(13))
        sheet.save(HERE/f'{name}-storyboard.jpg', quality=95)
        fn(0).save(HERE/f'{name}-poster.png')
        # Exact closure is an observable invariant, not a wording check.
        delta = ImageChops.difference(fn(0), fn(duration-1/FPS))
        assert delta.getbbox() is None, f'{key} loop boundary mismatch'


def render(key):
    name, fn, duration = VARIANTS[key]
    output = HERE/f'{name}.mp4'
    process = subprocess.Popen([str(FF), '-y', '-hide_banner', '-loglevel', 'error',
        '-f', 'rawvideo', '-vcodec', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}',
        '-r', str(FPS), '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'fast',
        '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(output)], stdin=subprocess.PIPE)
    try:
        for n in range(round(duration*FPS)):
            process.stdin.write(fn(n/FPS).tobytes())
            if n%(FPS*2)==0: print(f'{key}: {n/FPS:.0f}/{duration}s rendered', flush=True)
    finally:
        process.stdin.close()
    if process.wait(): raise RuntimeError(f'{key} render failed')
    # Decode every frame once to catch corrupt/truncated output.
    subprocess.run([str(FF), '-hide_banner', '-loglevel', 'error', '-i', str(output),
                    '-f', 'null', '-'], check=True)
    print(f'Saved and decoded {output.name}: {output.stat().st_size:,} bytes', flush=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--stills', action='store_true')
    parser.add_argument('--variant', choices=['A','B','both'], default='both')
    args = parser.parse_args()
    keys = ('A','B') if args.variant=='both' else (args.variant,)
    stills(keys)
    if not args.stills:
        for key in keys: render(key)
    (HERE/'render-details.json').write_text(json.dumps({'width':W,'height':H,'fps':FPS,
        'variants':{k:{'file':v[0]+'.mp4','duration':v[2]} for k,v in VARIANTS.items()},
        'same_video_for_all_placements':True,
        'original_assets_modified':False,
        'illustrative_states':['Face ID prompt','authentication loading','welcome'],
        'loop_endpoints_identical_before_encoding':True}, indent=2), encoding='utf-8')


if __name__=='__main__': main()
