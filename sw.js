// Make BASE_PATH dynamic based on environment
const BASE_PATH = location.hostname === 'localhost' || location.hostname === '127.0.0.1' 
    ? '' 
    : '/my-habit';

const CACHE_NAME = 'habit-tracker-v1';
const ASSETS_TO_CACHE = [
    BASE_PATH + '/',
    BASE_PATH + '/index.html',
    BASE_PATH + '/app.js',
    BASE_PATH + '/manifest.json',
    BASE_PATH + '/icon-192x192.png',
    BASE_PATH + '/icon-512x512.png',
    BASE_PATH + '/sounds/timer-end.mp3'
];

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
});

// Fetch events
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
