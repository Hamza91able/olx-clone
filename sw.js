// importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');
// var cacheName = 'v1';
const staticAssets = [
    './',
    './style.css',
    './app.js',
    './images/banner.jpg',
    './images/OLX-Logo.png',
    './images/user2.png',
    './index.html',
    './post-ad.html',
    './js/a3a5ef9e03.js',
    './js/bootstrap-toggle.min.js',
    './js/bootstrap.min.js',
    './js/firebase.js',
    './fonts/glyphicons-halflings-regular.woff2',
    './css/bootstrap-toggle.min.css',
    './css/bootstrap.min.css',
    './profile.html',
    './offline.js',
    './offline.css',
    './offline-language-english.css',
    './login.html',
    './404.html',
    './categories.html',
    './favicon.ico',
    "./jquery-3.3.1.min.js",
    './contact.html',
    './item.html',
    './post-ad.html',
    './register.html',
    './images/ajax-loader.gif',
    './categories.html?Mobiles#All%20Pakistan&',
    './categories.html?Electronics%20&%20Appliances#All%20Pakistan&',
    './categories.html?Vehicles#All%20Pakistan&',
    './categories.html?Bikes#All%20Pakistan&',
    './categories.html?Property%20for%20Sale#All%20Pakistan&',
    './categories.html?Property%20for%20Rent#All%20Pakistan&',
    './categories.html?Jobs#All%20Pakistan&',
    './categories.html?Services#All%20Pakistan&',
    './categories.html?Business,%20Industrial%20&%20Agriculture#All%20Pakistan&',
    './categories.html?Furniture%20&%20Home%20Decor#All%20Pakistan&',
    './categories.html?Animals#All%20Pakistan&',
    './categories.html?Books,%20Sports%20&%20Hobbies#All%20Pakistan&',
    './categories.html?Fashion%20&%20Beauty#All%20Pakistan&',
    './categories.html?Kids#All%20Pakistan&',
    './fallback.json',
    './images/fallback.png'
];

// const staticAssets2 = [
//     './categories.html',
// ];

// if (workbox) {
//     console.log(`Yay! Workbox is loaded 🎉`);

//     workbox.precaching.precacheAndRoute(staticAssets2);

// } else {
//     console.log(`Boo! Workbox didn't load 😬`);
// }

self.addEventListener('install', async event => {
    // waitUntil() ensures that the Service Worker will not
    // install until the code inside has successfully occurred
    event.waitUntil(
        // Create cache with the name supplied above and
        // return a promise for it
        caches.open('olx-static').then(function (cache) {
            // Important to `return` the promise here to have `skipWaiting()`
            // fire after the cache has been updated.
            return cache.addAll(staticAssets);
        }).then(function () {
            // `skipWaiting()` forces the waiting ServiceWorker to become the
            // active ServiceWorker, triggering the `onactivate` event.
            // Together with `Clients.claim()` this allows a worker to take effect
            // immediately in the client(s).
            return self.skipWaiting();
        })
    );
    // const cache = await caches.open('olx-static2');
    // cache.addAll(staticAssets);
});

self.addEventListener('activate', event => {
    // `claim()` sets this worker as the active worker for all clients that
    // match the workers scope and triggers an `oncontrollerchange` event for
    // the clients.
    return self.clients.claim();
});

self.addEventListener('fetch', event => {
    const req = event.request;
    // console.log(req);
    const url = new URL(req.url);
    // console.log(url.origin, location.origin);
    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(req));
        // console.log("Cache First");
    }
    else {
        event.respondWith(networkFirst(req));
        // console.log("Netword First");
    }
});

async function cacheFirst(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open('olx-dynamic');
    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (error) {
        const cachedResponse = await cache.match(req);
        return cachedResponse || await cache.match('./fallback.json');
    }
}

function fetchFromNetworkAndCache(e) {
    if (e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') return;

    return fetch(e.request).then(res => {
        // foreign requests may be res.type === 'opaque' and missing a url
        if (!res.url) return res;
    });
}