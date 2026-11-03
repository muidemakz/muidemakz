const CACHE='nsimbi-independent-prototype-v5';
const FILES=['./','./index.html','./styles.css','./polish.css','./app.mjs','./model.mjs','./assets/icons.mjs','./assets/PlusJakartaSans.ttf','./manifest.webmanifest','./assets/app-icon-192.png','./assets/app-icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;
  }).catch(()=>caches.match(event.request)));
});
