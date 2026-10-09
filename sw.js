const C='umbral-v1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.add('./index.html')).catch(()=>{}));});
self.addEventListener('activate',e=>{self.clients.claim();e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=>k!==C?caches.delete(k):null))));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const req=e.request, url=new URL(req.url);
  const isDoc=req.mode==='navigate'||url.pathname==='/'||url.pathname.endsWith('/index.html');
  if(isDoc){
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put('./index.html',cp));return r;}).catch(()=>caches.match('./index.html')));
  }else{
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(resp=>{const cp=resp.clone();caches.open(C).then(c=>c.put(req,cp));return resp;}).catch(()=>r)));
  }
});
