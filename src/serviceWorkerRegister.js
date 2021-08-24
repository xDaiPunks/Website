export function unregister() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.ready.then((registration) => {
			registration.unregister();
		});
	}
}

export function localhostDetect() {
	const hostname = window.location.hostname;
	const hostRegex = new RegExp(
		/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
	);

	return (
		hostname === '[::1]' ||
		hostname === 'localhost' ||
		hostRegex.test(hostname)
	);
}

export function checkValidSW(swUrl) {
	// Check if the service worker can be found. If it can't reload the page.
	fetch(swUrl)
		.then((response) => {
			// Ensure service worker exists, and that we really are getting a JS file.
			if (
				response.status === 404 ||
				response.headers.get('content-type').indexOf('javascript') ===
					-1
			) {
				// No service worker found. Probably a different app. Reload the page.
				navigator.serviceWorker.ready.then((registration) => {
					registration.unregister().then(() => {
						window.location.reload();
					});
				});
			} else {
				// Service worker found. Proceed as normal.
				registerValidSW(swUrl);
			}
		})
		.catch(() => {
			console.log(
				'No internet connection found. App is running in offline mode.'
			);
		});
}

export function registerValidSW(swUrl) {
	navigator.serviceWorker
		.register(swUrl)
		.then((registration) => {
			registration.onupdatefound = () => {
				const installingWorker = registration.installing;
				installingWorker.onstatechange = () => {
					if (installingWorker.state === 'installed') {
						if (navigator.serviceWorker.controller) {
							registration.unregister();
							window.location.reload();
						} else {
							console.log('Content is cached for offline use.');
						}
					}
				};
			};
		})
		.catch((error) => {
			console.error('Error during service worker registration:', error);
		});
}

export default function registerServiceWorker() {
	let localhost;
	let publicUrl;
	let serviceWorkerUrl;

	if ('serviceWorker' in navigator) {
		localhost = localhostDetect();
		publicUrl = new URL(process.env.PUBLIC_URL, window.location);

		if (publicUrl.origin !== window.location.origin) {
			return;
		}

		window.addEventListener('load', (event) => {
			serviceWorkerUrl = process.env.PUBLIC_URL + 'service-worker.js';

			if (localhost === false) {
				checkValidSW(serviceWorkerUrl);
			} else {
				registerValidSW(serviceWorkerUrl);
			}
		});
	}
}
