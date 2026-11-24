// A self-destructing service worker (2026-09-11). It exists only so that devices holding the
// old caching worker have something to update *to*: deleting the file would have left them on
// it forever. No fetch handler, so every request goes to the network.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
	event.waitUntil((async () => {
		for (const key of await caches.keys()) {
			await caches.delete(key);
		}
		await self.registration.unregister();
		for (const client of await self.clients.matchAll({ type: 'window' })) {
			client.navigate(client.url);
		}
	})());
});
