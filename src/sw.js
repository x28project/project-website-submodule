// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open('v1')
      .then((cache) =>
        cache.addAll(['/', '/bundle.js', '/index.html', '/styles.min.css'])
      )
  );
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((matchResponse) => {
      if (matchResponse !== undefined) {
        return matchResponse;
      }
      return fetch(event.request).then((fetchResponse) => {
        const fetchResponseClone = fetchResponse.clone();
        caches.open('v1').then((cache) => {
          cache.put(event.request, fetchResponseClone);
        });
        return fetchResponse;
      });
    })
  );
});
