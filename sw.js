// ===================================
// ROAD SMART AID - Service Worker
// Версия: 2.0 (с авто-очисткой кэша)
// ===================================

const CACHE_NAME = 'road-smart-aid-v' + Date.now();

const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/скрипт.js',
    '/styles.css',
    '/manifest.json'
];

// 📥 Установка Service Worker
self.addEventListener('install', event => {
    console.log('✅ SW: Установка начата');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('✅ SW: Кэш открыт:', CACHE_NAME);
            return cache.addAll(ASSETS_TO_CACHE).then(() => {
                console.log('✅ SW: Ресурсы закэшированы');
            });
        }).catch(err => {
            console.error('❌ SW: Ошибка кэширования:', err);
        })
    );
    // Сразу активируем новую версию
    self.skipWaiting();
});

// 🔄 Активация Service Worker (очистка старого кэша)
self.addEventListener('activate', event => {
    console.log('✅ SW: Активация начата');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => {
                        console.log('🗑️ SW: Удаляем старый кэш:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => {
            console.log('✅ SW: Старый кэш очищен');
            return self.clients.claim();
        })
    );
});

// 🌐 Перехват запросов
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                console.log('💾 SW: Найдено в кэше:', event.request.url);
                return response;
            }
            console.log('🌐 SW: Загрузка из сети:', event.request.url);
            return fetch(event.request).catch(err => {
                console.error('❌ SW: Ошибка сети:', err);
                // Можно вернуть офлайн-страницу если есть
            });
        })
    );
});
