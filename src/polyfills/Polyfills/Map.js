if (typeof Map === 'undefined') {
	require('core-js/features/map');
} else {
	try {
		new Map([['k', 'v']]);
	} catch (e) {
		// Native Map doesn't support constructor arguments (Safari 8 and below).
		require('core-js/features/map');
	}
}
