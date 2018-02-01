var cacheName = 'merlin';
var dataCacheName = 'merlin-v1';
var filesToCache = [
  	'/',
  	'/index.html',
  	'/app.js',
  	'/assets/images/snow.png',
  	'/assets/images/thunderstorm.png',
];

self.addEventListener('install', event => {
    console.log('[SW] Install');
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log('[SW] Cacheing app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', event => {
    console.log('[SW] Activate');
    //caches.keys().then(keyList => {
    //    return Promise.all(keyList.map(key => {
    //        console.log('[SW] Remove old cache');
    //        return caches.delete(key);
    //    }))
    //});
    //return self.clients.claim();
});

self.addEventListener('fetch', event => {
  	console.log('[SW] Fetch', event.request.url);
    const url = new URL(event.request.url);

    if (url.origin == location.origin && url.pathname == '/assets/images/snow.png') {
      console.log('here');
      event.respondWith(caches.match('/assets/images/thunderstorm.png'));
    }
});


