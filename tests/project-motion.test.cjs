const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../js/project-motion.js'), 'utf8');

class Events {
  constructor() { this.events = {}; this.dataset = {}; }
  addEventListener(name, fn) { (this.events[name] ||= []).push(fn); }
  emit(name, event={}) { for (const fn of this.events[name] || []) fn(event); }
  setAttribute(name, value) { this[name] = value; }
}

function fixture(mode='visible', reduce=false, deferred=false) {
  const video = new Events(), toggle = new Events(), replay = new Events();
  const root = new Events(), document = new Events(), preference = new Events();
  const shelf = {dataset:{motionPaused:'false'}};
  let intersect, mutation, resolvePlay;
  video.paused = true; video.currentTime = 0; video.calls = 0;
  video.pause = () => { video.paused = true; video.emit('pause'); };
  video.play = () => {
    video.calls++;
    const finish = () => { video.paused = false; video.emit('playing'); };
    if (deferred) return new Promise(resolve => { resolvePlay = () => { finish(); resolve(); }; });
    finish(); return Promise.resolve();
  };
  root.dataset = {motionMode:mode,motionLabel:'Fundall preview'};
  root.isConnected = true; root.active = true; root.list = false;
  root.classList = {contains:()=>root.active};
  root.closest = selector => selector === '.story-shelf' ? shelf : root.list ? {} : null;
  root.contains = el => el === toggle || el === replay;
  root.querySelector = selector => selector==='[data-motion-video]' ? video :
    selector==='[data-motion-frame]' ? null :
    selector==='[data-motion-toggle]' ? toggle : replay;
  root.querySelectorAll = () => [];
  document.hidden = false;
  document.querySelectorAll = () => root.isConnected ? [root] : [];
  document.getElementById = () => null;
  preference.matches = reduce;
  class IntersectionObserver {
    constructor(callback) { intersect = callback; }
    observe() {} disconnect() {}
  }
  class MutationObserver {
    constructor(callback) { mutation = callback; }
    observe() {} disconnect() {}
  }
  vm.runInNewContext(source, {window:{matchMedia:()=>preference},document,
    IntersectionObserver,MutationObserver,Map,location:{origin:'https://portfolio.test'}});
  return {video,toggle,replay,root,document,preference,shelf,
    show(value=true) { intersect([{isIntersecting:value,intersectionRatio:value?1:0}]); },
    changeStory() { mutation(); }, resolve() { resolvePlay(); }};
}

function frameFixture(mode='visible', reduce=false) {
  const frame = new Events(), toggle = new Events(), replay = new Events();
  const root = new Events(), document = new Events(), preference = new Events();
  const shelf = {dataset:{motionPaused:'false'}};
  let intersect, mutation;
  frame.messages = [];
  frame.contentWindow = {postMessage(message, origin) { frame.messages.push({message, origin}); }};
  root.dataset = {motionMode:mode,motionLabel:'Valideity preview'};
  root.isConnected = true; root.active = true; root.list = false;
  root.classList = {contains:()=>root.active};
  root.closest = selector => selector === '.story-shelf' ? shelf : root.list ? {} : null;
  root.contains = el => el === toggle || el === replay;
  root.querySelector = selector => selector==='[data-motion-frame]' ? frame :
    selector==='[data-motion-toggle]' ? toggle : replay;
  root.querySelectorAll = () => [];
  document.hidden = false;
  document.querySelectorAll = () => root.isConnected ? [root] : [];
  document.getElementById = () => null;
  preference.matches = reduce;
  class IntersectionObserver {
    constructor(callback) { intersect = callback; }
    observe() {} disconnect() {}
  }
  class MutationObserver {
    constructor(callback) { mutation = callback; }
    observe() {} disconnect() {}
  }
  vm.runInNewContext(source, {window:{matchMedia:()=>preference},document,
    IntersectionObserver,MutationObserver,Map,location:{origin:'https://portfolio.test'}});
  return {frame,toggle,replay,root,document,preference,shelf,
    show(value=true) { intersect([{isIntersecting:value,intersectionRatio:value?1:0}]); },
    changeStory() { mutation(); }};
}

const settle = () => new Promise(resolve=>setImmediate(resolve));

test('case loops play on visibility, pause offscreen and retain a manual pause', async()=>{
  const f=fixture(); f.show(); await settle();
  assert.equal(f.video.loop,true); assert.equal(f.video.paused,false);
  f.video.currentTime=4; f.toggle.emit('click'); assert.equal(f.video.paused,true);
  f.show(false); f.show(); await settle(); assert.equal(f.video.paused,true);
  f.replay.emit('click'); await settle();
  assert.equal(f.video.currentTime,0); assert.equal(f.video.paused,false);
});

test('reduced motion stays static until explicitly played, and responds to preference changes', async()=>{
  const f=fixture('visible',true); f.show(); await settle();
  assert.equal(f.video.calls,0);
  f.toggle.emit('click'); await settle(); assert.equal(f.video.paused,false);
  f.preference.emit('change'); assert.equal(f.video.paused,true);
});

test('Work ignores touch hover, supports focus and pauses in list view', async()=>{
  const f=fixture('hover'); f.show();
  f.root.emit('pointerenter',{pointerType:'touch'}); assert.equal(f.video.calls,0);
  f.root.emit('focusin'); await settle(); assert.equal(f.video.paused,false);
  f.root.list=true; f.document.emit('projectmotionrefresh'); assert.equal(f.video.paused,true);
  f.root.list=false; f.document.emit('projectmotionrefresh'); await settle();
  assert.equal(f.video.paused,false);
  f.root.emit('focusout',{relatedTarget:null}); assert.equal(f.video.paused,true);
  assert.equal(f.video.currentTime,0);
});

test('active homepage card respects the shared pause control', async()=>{
  const f=fixture('story'); f.show(); await settle(); assert.equal(f.video.paused,false);
  f.shelf.dataset.motionPaused='true'; f.document.emit('projectmotionrefresh');
  assert.equal(f.video.paused,true);
  f.shelf.dataset.motionPaused='false'; f.document.emit('projectmotionrefresh');
  await settle(); assert.equal(f.video.paused,false);
  f.root.active=false; f.changeStory(); assert.equal(f.video.paused,true);
});

test('a late play promise cannot keep an inactive card playing', async()=>{
  const f=fixture('story',false,true); f.show();
  f.root.active=false; f.changeStory(); f.resolve(); await settle();
  assert.equal(f.video.paused,true);
});

test('background tabs and removed cards stop playback', async()=>{
  const f=fixture('hover'); f.show(); f.root.emit('focusin'); await settle();
  f.toggle.emit('click'); f.video.currentTime=3;
  f.document.hidden=true; f.document.emit('visibilitychange');
  f.document.hidden=false; f.document.emit('visibilitychange'); await settle();
  assert.equal(f.video.paused,true); assert.equal(f.video.currentTime,3);
  f.root.isConnected=false; f.document.emit('projectmotionrefresh');
  assert.equal(f.video.paused,true);
});

test('embedded workflow motion follows visibility, hover controls, and reduced motion',()=>{
  const f=frameFixture('visible');
  f.show();
  f.frame.emit('load');
  assert.deepEqual(f.frame.messages.map(x=>x.message.action),['play']);
  f.show(false);
  assert.deepEqual(f.frame.messages.map(x=>x.message.action),['play','pause']);

  const hover=frameFixture('hover');
  hover.show();
  hover.frame.emit('load');
  hover.root.emit('pointerenter',{pointerType:'mouse'});
  assert.equal(hover.frame.messages.at(-1).message.action,'play');
  hover.toggle.emit('click');
  assert.equal(hover.frame.messages.at(-1).message.action,'pause');
  hover.replay.emit('click');
  assert.equal(hover.frame.messages.at(-1).message.action,'replay');
  hover.root.list=true;
  hover.document.emit('projectmotionrefresh');
  assert.equal(hover.frame.messages.at(-1).message.action,'reset');

  const reduced=frameFixture('visible',true);
  reduced.show();
  reduced.frame.emit('load');
  assert.equal(reduced.frame.messages.length,0);
  reduced.toggle.emit('click');
  assert.equal(reduced.frame.messages.at(-1).message.action,'play');
});
