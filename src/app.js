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

})();
