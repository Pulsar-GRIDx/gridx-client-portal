/* eslint-disable no-restricted-globals */

self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: 'Logo.png',
      badge: 'Logo.png'
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  