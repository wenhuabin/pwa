const applicationServerPublicKey = 'BJyo2XyO3lS9sQV8LnDFCC9oZ13BX0mFGqQEzJorVJQbyfIeAi0ncW1Qj0FWbjd4z2yljza19xHclBQGNKbea3o';

(function() {
    // Create a Message Channel
    var msg_chan =  null;
    let swRegistration = null;
    let isSubscribed = false;
    
    const img = new Image();
    img.src = '/assets/images/snow.png';
    document.body.appendChild(img);

    //setTimeout(() => {
    //  const img = new Image();
    //  img.src = '/assets/images/thunderstorm.png';
    //  document.body.appendChild(img);
    //}, 5000);

    
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        console.log('register');
        navigator.serviceWorker
  	           //.register('./service-worker.js')
               .register('service-worker.js', { scope: './' })
  	           .then(function(swReg) {
                    swRegistration = swReg;
                    console.log('Service Worker Registered');
                    initialize();
               });

        // init a Message Channel
        msg_chan = new MessageChannel();
        // Handler for recieving message reply from service worker
        msg_chan.port1.onmessage = function(event){
            if(event.data.error){
                console.log(event.data.error);
            }else{
                console.log('here', event.data);
            }
        };

        function send_message_to_sw(msg){
            // Send message to service worker along with port for reply
            navigator.serviceWorker.controller.postMessage("Client says '"+msg+"'", [msg_chan.port2]);
        }

        setTimeout(()=>send_message_to_sw('Hello world!'), 3000);


        navigator.serviceWorker.addEventListener('message', function(event){
            console.log("Client Received Message: " + event.data);
            event.ports[0].postMessage("Client Says 'Hello back!'");
        });
  	}

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

    function subscribeUser() {
        const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
        swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
        })
        .then(function(subscription) {
            console.log('User is subscribed.');
            isSubscribed = true;
        })
        .catch(function(err) {
            console.log('Failed to subscribe the user: ', err);
        });
    }
    
    function unsubscribeUser() {
        swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
            if (subscription) {
                return subscription.unsubscribe();
            }
        })
        .catch(function(error) {
            console.log('Error unsubscribing', error);
        })
        .then(function() {
          console.log('User is unsubscribed.');
          isSubscribed = false;
        });
    }
    
    function initialize() {
    
        // Set the initial subscription value
        swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
            isSubscribed = !(subscription === null);

            isSubscribed || subscribeUser();
    
            if (isSubscribed) {
              console.log('User IS subscribed.');
            } else {
              console.log('User is NOT subscribed.');
            }
        });
    }

})();
