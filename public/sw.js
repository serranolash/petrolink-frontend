// client/public/sw.js
const CACHE_NAME = 'energy-compliance-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Interceptar fetch para caché
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Clone request para fetch
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(response => {
                    // Verificar respuesta válida
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone response para cache
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
    );
});

// Sincronización en background
self.addEventListener('sync', event => {
    if (event.tag === 'sync-permits') {
        event.waitUntil(syncPendingPermits());
    }
});

async function syncPendingPermits() {
    const db = await openDB('EnergyComplianceDB', 1);
    const pending = await db.getAll('pendingPermits');
    
    for (const permit of pending) {
        try {
            const response = await fetch('/api/permits/offline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(permit)
            });
            
            if (response.ok) {
                await db.delete('pendingPermits', permit.id);
            }
        } catch (error) {
            console.error('Background sync failed:', error);
        }
    }
}