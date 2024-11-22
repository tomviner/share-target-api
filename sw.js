self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('word-counter-v2').then((cache) => {
            return cache.addAll([
                'index.html',
                'manifest.json'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Handle share target requests
    if (event.request.url.includes('share-target')) {
        event.respondWith(
            (async () => {
                const url = new URL(event.request.url);
                const sharedUrl = url.searchParams.get('url');

                // Redirect to the word counter service
                return Response.redirect(`https://mywebsite.com/countwords?URL=${encodeURIComponent(sharedUrl)}`, 302);
            })()
        );
    } else {
        // Handle regular fetch requests
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    return response || fetch(event.request);
                })
        );
    }
});
