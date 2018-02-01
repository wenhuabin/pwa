(function() {
    
    setTimeout(() => {
      const img = new Image();
      img.src = '/assets/images/snow.png';
      document.body.appendChild(img);
    }, 3000);
    setTimeout(() => {
      const img = new Image();
      img.src = '/assets/images/snow.png';
      document.body.appendChild(img);
    }, 6000);
    if ('serviceWorker' in navigator) {
        console.log('register');
        navigator.serviceWorker
  	           .register('/service-worker.js')
  	           .then(function() {
                   console.log('Service Worker Registered');
               });
  	}
})();
