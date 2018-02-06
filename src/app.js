(function() {
    
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

        function send_message_to_sw(msg){
            navigator.serviceWorker.controller.postMessage("Client 1 says '"+msg+"'");
        }

        setTimeout(()=>send_message_to_sw('Hello world!'), 2000);
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
})();
