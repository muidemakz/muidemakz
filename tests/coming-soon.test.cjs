const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { resolvePreview, previewMetadata } = require('../js/project-preview.js');
const root = path.resolve(__dirname, '..');
const projects = vm.runInNewContext(fs.readFileSync(path.join(root, 'js/data.js'), 'utf8') + ';PROJECTS');
const pending = projects.filter(project => project.status === 'coming-soon');

test('all 18 unfinished entries have distinct working preview routes', () => {
  assert.equal(pending.length, 18);
  assert.equal(new Set(pending.map(project => project.slug)).size, 18);
  for (const project of pending) {
    const url = new URL(project.link, 'https://muidemakz.com/');
    assert.equal(url.pathname, '/project-preview.html');
    assert.equal(resolvePreview(projects, url.search), project);
    assert.equal(fs.existsSync(path.join(root, url.pathname)), true);
  }
});

test('the eleven existing case-study links and availability stay intact', () => {
  assert.deepEqual(Array.from(projects.filter(project => project.status !== 'coming-soon'), project => project.link), [
    'omnione.html', 'fundall.html', 'teesaslms.html', 'valideity.html',
    'empty-state.html', 'cardtonic.html', 'moniepoint-verification.html', 'sun-king.html',
    'coreloops.html', 'venx.html', 'raven-pay.html'
  ]);
});

test('unknown, missing, or markup-like preview IDs fail safely', () => {
  for (const search of ['', '?project=', '?project=unknown', '?project=omnione', '?project=%3Cscript%3E']) {
    assert.equal(resolvePreview(projects, search), null);
  }
});

test('tentative years/categories are not repeated as confirmed preview metadata', () => {
  const tentative = pending.find(project => project.slug === 'fundall-v2');
  assert.equal(tentative.confirmed, false);
  assert.deepEqual(previewMetadata(tentative), []);
  const confirmed = pending.find(project => project.slug === 'traction-wallet');
  assert.deepEqual(previewMetadata(confirmed), ['2023', 'UI Design', 'UX Design']);
  assert.equal(pending.filter(project => project.preview?.role).length, 0);
  assert.equal(pending.filter(project => project.preview?.summary).length, 3);
});

test('the static preview is noindex, remains crawlable, and is absent from the sitemap', () => {
  const html = fs.readFileSync(path.join(root, 'project-preview.html'), 'utf8');
  assert.match(html, /<meta name="robots" content="noindex, follow">/);
  assert.doesNotMatch(fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8'), /project-preview/);
  assert.doesNotMatch(fs.readFileSync(path.join(root, 'robots.txt'), 'utf8'), /Disallow:\s*\/(?:\s*$|project-preview)/m);
});

function element(tag) {
  const classes = new Set();
  return { tag, children: [], style: {}, dataset: {}, attributes: {},
    classList: { add: name => classes.add(name), contains: name => classes.has(name) },
    appendChild(child) { this.children.push(child); },
    setAttribute(name, value) { this.attributes[name] = value; }
  };
}
const workSource = fs.readFileSync(path.join(root, 'js/work.js'), 'utf8');
const buildSource = workSource.slice(workSource.indexOf('function buildCardEl('), workSource.indexOf('function isDefaultState('));
const buildCard = vm.runInNewContext('(' + buildSource + ')', { document: { createElement: element } });

test('coming-soon cards are real links and keep their visible availability tag', () => {
  for (const project of pending) {
    const card = buildCard(project);
    assert.equal(card.classList.contains('is-soon'), true);
    assert.equal(card.classList.contains('is-linked'), true);
    const hit = card.children.find(child => child.className === 'work-card-hit');
    const tag = card.children.find(child => child.className === 'work-card-soon');
    assert.equal(hit.href, project.link);
    assert.match(hit.attributes['aria-label'], /case study coming soon/);
    assert.equal(tag.textContent, 'Coming Soon');
  }
  const ready = buildCard(projects[0]);
  assert.equal(ready.classList.contains('is-soon'), false);
  assert.equal(ready.children.some(child => child.className === 'work-card-soon'), false);
});
