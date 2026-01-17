// 服务工作者版本
const CACHE_NAME = 'coins-calculator-v1.0.0';

// 需要缓存的资源
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/app.js',
  '/scripts/calculator.js',
  '/scripts/roll.js',
  '/manifest.json',
  '/assets/images/favicon.ico',
  '/assets/images/favicon-96x96.png',
  '/assets/images/apple-touch-icon.png',
  '/assets/images/web-app-manifest-192x192.png',
  '/assets/images/web-app-manifest-512x512.png'
];

// 安装事件
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活事件
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 获取事件
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在缓存中找到，返回缓存
        if (response) {
          return response;
        }
        
        // 否则从网络获取
        return fetch(event.request).then(response => {
          // 检查是否有效响应
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // 克隆响应
          const responseToCache = response.clone();
          
          // 将新资源添加到缓存
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        // 如果网络和缓存都失败，显示离线页面
        return caches.match('/index.html');
      })
  );
});

// 监听消息
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
