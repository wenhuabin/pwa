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
    caches.keys().then(keyList => {
        return Promise.all(keyList.map(key => {
            console.log('[SW] Remove old cache');
            return caches.delete(key);
        }))
    });
    return self.clients.claim();
});

self.addEventListener('fetch', event => {
  	console.log('[SW] Fetch', event.request.url);

    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      )
    );

});

self.addEventListener('message', function(event){
    console.log("SW Received Message: " + event.data);
    event.ports[0].postMessage("SW Says 'Hello back!'");
});

function sendMsgToClients(t, msg){
    t.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage('hello from the other side'));
    });
}
