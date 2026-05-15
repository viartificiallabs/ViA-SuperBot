const CACHE_NAME = 'stratch-os-bunker-v1';
const ASSETS = [
  '/',
  '/index.html',
  // Tu ajouteras ici tes scripts compilés
];

// Installation : Le Bunker se remplit de provisions
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Mise en cache des artefacts de la Cité Évo');
      return cache.addAll(ASSETS);
    })
  );
});

// Interception : Le Mode Spectre du réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Retourne le cache (vie locale) ou va chercher sur le réseau
      return response || fetch(event.request);
    })
  );
});
