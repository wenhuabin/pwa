(function() {
    // Create a Message Channel
    var msg_chan =  null;
    
    const img = new Image();
    img.src = '/assets/images/snow.png';
    document.body.appendChild(img);

    setTimeout(() => {
      const img = new Image();
      img.src = '/assets/images/thunderstorm.png';
      document.body.appendChild(img);
    }, 5000);

    if ('serviceWorker' in navigator) {
        console.log('register');
        navigator.serviceWorker
  	           .register('/service-worker.js')
  	           .then(function() {
                   console.log('Service Worker Registered');
               });
        navigator.serviceWorker.addEventListener('message', function(event){
            console.log("Client Received Message: " + event.data);
            //event.ports[0].postMessage("Client 1 Says 'Hello back!'");
        });

        // init a Message Channel
        msg_chan = new MessageChannel();
        // Handler for recieving message reply from service worker
        msg_chan.port1.onmessage = function(event){
            if(event.data.error){
                console.log(event.data.error);
            }else{
                console.log(event.data);
            }
        };

        function send_message_to_sw(msg){
            // Send message to service worker along with port for reply
            navigator.serviceWorker.controller.postMessage("Client says '"+msg+"'", [msg_chan.port2]);
        }

        setTimeout(()=>send_message_to_sw('Hello world!'), 3000);
        //navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        //  // Let's see if you have a subscription already
        //  console.log('here');
        //  return serviceWorkerRegistration.pushManager.getSubscription();
        //}).then(function(subscription) {
        //  if (!subscription) {
        //    // You do not have subscription
        //    console.log('no subscription');
        //  }
        //  // You have subscription.
        //  // Send data to service worker
        //  console.log('subscription');
        //  navigator.serviceWorker.controller.postMessage('Hello world!');
        //
        //})
  	}

    //window.addEventListener('message', event => {
    //    console.log(event) 
    //}, false);

})();
