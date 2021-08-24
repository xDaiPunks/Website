/* eslint-disable no-restricted-globals */

var cacheName = 'xdaipunks.sw';

var base;
var baseDefault = 'http://localhost:3000';

var workerBase;

var cache;
var cacheComplete;

var pageCache;
var pageCacheComplete;

var cacheDefault = [workerBase, workerBase + '/'];
var cachCompleteDefault = [workerBase, workerBase + '/'];

var noCheckCacheArray = [];

workerBase = base || baseDefault;

pageCache = cache || cacheDefault;
pageCacheComplete = cacheComplete || cachCompleteDefault;

// Check if current url is in the noCheckCacheArray list
function noCheckCache(url) {
	if (this.match(url)) {
		return false;
	}
	return true;
}

// Install
self.addEventListener('install', function (e) {
	e.waitUntil(
		caches.open(cacheName).then(function (cache) {
			return cache
				.addAll(pageCacheComplete)
				.catch(function (errorAddAll) {});
		})
	);
});

// Activate
self.addEventListener('activate', function (e) {
	e.waitUntil(
		caches
			.keys()
			.then(function (keyList) {
				return Promise.all(
					keyList.map(function (key) {
						if (key !== cacheName) {
							return caches.delete(key);
						}
					})
				);
			})
			.catch(function (error) {})
	);
});

// Fetch
self.addEventListener('fetch', function (e) {
	// Return if request url protocal isn't http or https
	if (!e.request.url.match(/^(http|https):\/\//i)) {
		return;
	}

	// Return if request url is from an external domain.
	if (new URL(e.request.url).origin !== location.origin) {
		return;
	}

	// Return if the current request url is in the never cache list
	if (!noCheckCacheArray.every(noCheckCache, e.request.url)) {
		return;
	}

	// For POST requests, do not use the cache. Serve offline page if offline.
	if (e.request.method !== 'GET') {
		e.respondWith(
			fetch(e.request)
				.catch(function () {
					return caches.match(workerBase + '/');
				})
				.catch(function (error) {})
		);
		return;
	}

	// Revving strategy needed to stay updated but fine tune for static content..

	if (e.request.mode === 'navigate' && navigator.onLine) {
		e.respondWith(
			fetch(e.request)
				.then(function (response) {
					if (response.status !== 200) {
						return response;
					}

					if (response.status === 200) {
						return caches
							.open(cacheName)
							.then(function (cache) {
								cache.put(e.request, response.clone());
								return response;
							})
							.catch(function (error) {
								return response;
							});
					}
				})
				.catch(function (error) {})
		);
		return;
	}

	e.respondWith(
		caches
			.match(e.request)
			.then(function (response) {
				if (response) {
					return response;
				} else {
					return fetch(e.request)
						.then(function (fetchResponse) {
							if (fetchResponse.status !== 200) {
								return fetchResponse;
							}

							if (fetchResponse.status === 200) {
								return caches
									.open(cacheName)
									.then(function (cache) {
										cache.put(
											e.request,
											fetchResponse.clone()
										);
										return fetchResponse;
									})
									.catch(function (error) {
										return fetchResponse;
									});
							}
						})
						.catch(function (error) {
							//return error
						});
				}
			})
			.catch(function () {
				return caches.match(workerBase + '/');
			})
	);
});

// Message handler
self.addEventListener('message', function (event) {
	if (event.data === 'updateCache') {
		caches.open(cacheName).then(function (cache) {
			cache.addAll(pageCache).catch(function (errorAddAll) {
				console.log(errorAddAll);
			});
		});
	}

	if (event.data === 'updateCacheComplete') {
		caches.open(cacheName).then(function (cache) {
			cache.addAll(pageCacheComplete).catch(function (errorAddAll) {
				console.log(errorAddAll);
			});
		});
	}
});
