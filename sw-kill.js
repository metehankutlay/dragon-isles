// 2026-09-11: unregisters the service worker any device is still holding from an earlier build.
navigator.serviceWorker?.getRegistrations?.().then((rs) => rs.forEach((r) => r.unregister()));
caches?.keys?.().then((ks) => ks.forEach((k) => k.startsWith('Dragon Isles-sw-cache-') && caches.delete(k)));
