/* Local preview server that follows _redirects the way Netlify does, so clean addresses
   (/work, /about, /fundall) work on your machine too. Run: node scripts/serve.mjs  (port 5500) */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const port = Number(process.env.PORT) || 5500;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.m4a': 'audio/mp4', '.mp3': 'audio/mpeg', '.pdf': 'application/pdf', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml' };
const rules = fs.existsSync('_redirects')
  ? fs.readFileSync('_redirects', 'utf8').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map((l) => l.split(/\s+/))
  : [];

function send(res, file, req, status = 200) {
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) {
      if (status === 404) { res.writeHead(404); return res.end('Not found'); }
      return send(res, path.join(root, '404.html'), req, 404);
    }
    const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const range = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
    if (range && status === 200) {
      const start = range[1] ? Number(range[1]) : 0;
      const end = range[2] ? Math.min(Number(range[2]), st.size - 1) : st.size - 1;
      res.writeHead(206, { 'content-type': type, 'content-range': 'bytes ' + start + '-' + end + '/' + st.size, 'accept-ranges': 'bytes', 'content-length': end - start + 1, 'cache-control': 'no-store' });
      return fs.createReadStream(file, { start, end }).pipe(res);
    }
    res.writeHead(status, { 'content-type': type, 'content-length': st.size, 'accept-ranges': 'bytes', 'cache-control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  });
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let p = decodeURIComponent(url.pathname);
  for (const [from, to, code = '200'] of rules) {
    if (p !== from && p !== from + '/') continue;
    if (/^30\d/.test(code)) { res.writeHead(Number(code.replace('!', '')), { location: to + url.search }); return res.end(); }
    p = to;
    break;
  }
  let file = path.normalize(path.join(root, p));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (p.endsWith('/')) file = path.join(file, 'index.html');
  send(res, file, req);
}).listen(port, () => console.log('Portfolio on http://localhost:' + port));
