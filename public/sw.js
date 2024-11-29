// public/sw.js
const CACHE_NAME = "solvejet-cache-v1";

// Add the assets you want to cache
const INITIAL_CACHED_RESOURCES = [
  "/",
  "/index.html",
  "/pwa-icon.svg",
  "/manifest.webmanifest",
];

// Install event - cache initial resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Cache known resources
      await Promise.all(
        INITIAL_CACHED_RESOURCES.map(async (resource) => {
          try {
            await cache.add(resource);
          } catch (error) {
            console.log(`Failed to cache: ${resource}`, error);
          }
        })
      );
    })()
  );
});

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      try {
        // Try to get from cache first
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // If not in cache, get from network
        const response = await fetch(event.request);

        // Cache successful GET requests
        if (event.request.method === "GET" && response.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, response.clone());
        }

        return response;
      } catch (error) {
        // If offline and resource not cached, return fallback
        return new Response("Offline. Please check your internet connection.", {
          status: 503,
          statusText: "Service Unavailable",
          headers: new Headers({
            "Content-Type": "text/plain",
          }),
        });
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })()
  );
});

// Handle push notifications
self.addEventListener("push", (event) => {
  const options = {
    body: event.data?.text() || "New Update Available",
    icon: "/pwa-icon.svg",
    badge: "/pwa-icon.svg",
    vibrate: [100, 50, 100],
  };

  event.waitUntil(
    self.registration.showNotification("SolveJet Admin", options)
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
