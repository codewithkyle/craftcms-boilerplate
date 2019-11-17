const currentTimestamp = '1574022569123';

self.addEventListener('fetch', (event) => {
  const isCP = event.request.url.match(/(\/webmaster\/)|(\/cpresources\/)|(index\.php)/gi);
  if (isCP)
  {
    event.respondWith(
        fetch(event.request).then((response) => {
            return response;
        })
    );
  }
  else
  {
    event.respondWith(
      caches.match(event.request)
      .then((response) => {
        if (response)
        {
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            if (!response || response.status !== 200 || response.type !== 'basic')
            {
              return response;
            }

            var responseToCache = response.clone();

            caches.open(currentTimestamp)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return response;
          }
        );
      })
    );
  }
});
