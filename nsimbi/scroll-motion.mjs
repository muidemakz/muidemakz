const active=new WeakMap();
export function cancelScroll(el){const job=el&&active.get(el);if(!job)return;cancelAnimationFrame(job.frame);for(const type of ['wheel','touchstart','pointerdown','keydown'])el.removeEventListener(type,job.stop);active.delete(el);}
export function easeScroll(el,target,{animate=true}={}){if(!el)return;cancelScroll(el);const end=Math.max(0,Math.min(Number(target)||0,el.scrollHeight-el.clientHeight)),start=el.scrollTop;
 if(!animate||matchMedia('(prefers-reduced-motion: reduce)').matches||Math.abs(end-start)<1){el.scrollTop=end;return;}
 const duration=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion-scroll'))||280,began=performance.now(),job={frame:0,stop:()=>cancelScroll(el)};active.set(el,job);for(const type of ['wheel','touchstart','pointerdown','keydown'])el.addEventListener(type,job.stop,{passive:true});
 function tick(now){if(!el.isConnected){cancelScroll(el);return;}const progress=Math.min(1,(now-began)/duration),ease=.5-Math.cos(Math.PI*progress)/2;el.scrollTop=start+(end-start)*ease;if(progress<1)job.frame=requestAnimationFrame(tick);else{el.scrollTop=end;cancelScroll(el);}}
 job.frame=requestAnimationFrame(tick);
}
export function revealInThread(el,offset=16){const thread=el?.closest('.thread');if(!thread)return;easeScroll(thread,el.getBoundingClientRect().top-thread.getBoundingClientRect().top+thread.scrollTop-offset);}
