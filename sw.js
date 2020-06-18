const CACHE_PREFIX = "controls_player";
const CACHE_VERSION = 1;

const CACHE_NAME = `${CACHE_PREFIX}-v${CACHE_VERSION}`;

const TO_CACHE = [
    ".",
    "style.css",
    "main.js",
    "manifest.json",

    // icons
    "icons/icon.svg",
    "icons/icon-192.png",
    "icons/icon-512.png",
];

addEventListener("install", event => {
    event.waitUntil(caches.open(CACHE_NAME).then(async cache => {
        await cache.addAll(TO_CACHE);
        console.log("Finished caching resources");
    }));
});

addEventListener("activate", event => {
    event.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(name => {
            if (name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME) {
                return caches.delete(name);
            }
        }));
    }));
});

addEventListener("fetch", event => {
    event.respondWith(caches.match(event.request).then(response => {
        if (response) {
            return response;
        }
        return fetch(event.request);
    }));
});
