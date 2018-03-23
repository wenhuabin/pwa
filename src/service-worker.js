const applicationServerPublicKey = 'BH8-hIchXKMI6AKSee8gD0hhPThRqaEhIEtMJwcTjEQhiOKdG-_2tTIO-6hOAK4kwg5M9Saedjxp4hVE-khhWxY';
var cacheName = 'merlin';
var dataCacheName = 'merlin-v1';
var filesToCache = [
  	'/',
  	'/index.html',
  	//'/app.js',
  	//'/assets/images/snow.png',
  	//'/assets/images/thunderstorm.png',
];

function initWS(){
    console.log('init websocket');
    var ws = new WebSocket('ws://127.0.0.1:40510');
    // event emmited when connected
    ws.onopen = function () {
        console.log('websocket is connected ...')
        // sending a send event to websocket server
        ws.send('connected')
    }
    // event emmited when receiving message
    ws.onmessage = function (ev) {
        console.log(ev);
    }
}

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
    //initWS();
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
    //event.ports[0].postMessage("SW Says 'Hello back!'");
    sendMsgToClients('hello from the other side');
    //console.log('update service worker');
    //console.log('update service worker again');
});


/* eslint-enable max-len */

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    const title = '鹊桥仙';
    const options = {
      body: '两情若是久长时，又岂在朝朝暮暮',
      icon: 'assets/images/icon.png',
      badge: 'assets/images/badge.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
    sendMsgToClients('你有新的通知');
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
      clients.openWindow('https://wenhuabin.com')
    );
});

self.addEventListener('pushsubscriptionchange', function(event) {
    console.log('[Service Worker]: \'pushsubscriptionchange\' event fired.');
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    event.waitUntil(
      self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      })
      .then(function(newSubscription) {
        // TODO: Send to application server
        console.log('[Service Worker] New subscription: ', newSubscription);
      })
    );
});

function sendMsgToClients(msg){
    clients.matchAll().then(clients => {
        console.log(clients.length);
        clients.forEach(client => send_message_to_client(client, msg));
    });
}

function send_message_to_client(client, msg){
    var msg_chan = new MessageChannel();

    msg_chan.port1.onmessage = function(event){
        if(event.data.error){
            console.log(event.data.error);
        }else{
            console.log(event.data);
        }
    };

    client.postMessage("SW Says: '"+msg+"'", [msg_chan.port2]);
}
