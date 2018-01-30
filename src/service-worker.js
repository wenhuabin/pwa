var cacheName = 'xlsdPWA';
var dataCacheName = 'xlsdPWA-v1';
var filesToCache = [];

self.addEventListener('install', function(e) {
    console.log('[SW] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            console.log('[SW] Cacheing app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function(e) {
    console.log('[SW] Activate');
    caches.keys().then(function(keyList){
        return Promise.all(keyList.map(function(key){
            console.log('[SW] Remove old cache');
            return caches.delete(key);
        }
    })):
    return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  	console.log('[SW] Fetch', e.request.url);
    var dataUrl = 'https://query.yahooapis.com/v1/public/yql';
    if(e.request.url.indexOf(dataUrl) > -1){
        e.respondWith(
            caches.open(dataCacheName).then(function(cache){
                return fetch(e.request).then(function(response){
                    return response;
                });
            });
    }else{
        e.respondWith(
            cache.match(e.request).then(function(response){
                return response || fetch(e.request);
            });
        );
    }
});
