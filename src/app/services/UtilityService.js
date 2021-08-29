/* eslint-disable import/first */
/* eslint no-mixed-operators: "off" */
/* eslint no-useless-escape: "off" */

let Instance;

import querystring from 'querystring';

class UtilityService {
	constructor() {
		if (Instance) {
			return Instance;
		} else {
			Instance = this;

			Instance.pathRegex = Instance.initializePathRegex();
			Instance.browserSupport = Instance.initializeBrowserSupport();

			Instance.animationFrame = Instance.detectAnimationFrame();
			Instance.animationClearFrame = Instance.detectAnimationClearFrame();

			Instance.transformProperty = Instance.detectTransformProperty();
			Instance.transitionProperty = Instance.detectTransitionProperty();
			Instance.animationEndProperty = Instance.detectAnimationEndProperty();
			Instance.transitionEndProperty = Instance.detectTransitionEndProperty();
		}
	}

	noop() {
		return () => {};
	}

	zeroPad(number, places) {
		var zero = places - number.toString().length + 1;
		return Array(+(zero > 0 && zero)).join('0') + number;
	}

	upperCaseFirst(string) {
		return string.charAt(0).toUpperCase() + string.substring(1);
	}

	lowerCaseFirst(string) {
		return string.charAt(0).toLowerCase() + string.substring(1);
	}

	cloneObject(sourceObject) {
		return JSON.parse(JSON.stringify(sourceObject));
	}

	/*
	extendObject(sourceObject, overrideObject) {
		return { ...sourceObject, ...overrideObject };
	}
	*/

	extendObject(sourceObject, dataObject) {
		if (typeof dataObject !== 'object') {
			return sourceObject;
		}

		for (let k in dataObject) {
			sourceObject[k] = dataObject[k];
		}
		return sourceObject;
	}

	generateObject(data) {
		let jsonObject;
		try {
			jsonObject = JSON.parse(data);
		} catch (e) {
			jsonObject = null;
		}
		return jsonObject;
	}

	generateString(jsonObject) {
		let jsonString;
		try {
			jsonString = JSON.stringify(jsonObject);
		} catch (e) {}
		return jsonString;
	}

	mergeArraysByProperty(prop, arrays) {
		let mergedArray;
		let mergedObject = {};

		arrays.forEach((arrayItem) => {
			arrayItem.forEach((item) => {
				mergedObject[item[prop]] = Object.assign(
					{},
					mergedObject[item[prop]],
					item
				);
			});
		});

		mergedArray = Object.values(mergedObject);
		mergedArray.sort((a, b) => (a[prop] < b[prop] ? 1 : -1));
		return mergedArray;
	}

	punkArrayFromObject(object) {
		let key;
		const array = [];

		for (key in object) {
			array.push(object[key]);
		}

		return array;
	}

	punkObjectFromArray(array) {
		let i;
		let iCount;

		const object = {};

		for (i = 0, iCount = array.length; i < iCount; i++) {
			object[array[i].idx] = array[i];
		}

		return object;
	}

	flattenObject(data) {
		let result = {};

		function recurse(cur, prop) {
			if (Object(cur) !== cur) {
				result[prop] = cur;
			} else if (Array.isArray(cur)) {
				for (let i = 0, l = cur.length; i < l; i++) {
					recurse(cur[i], prop + '[' + i + ']');

					if (l === 0) {
						result[prop] = [];
					}
				}
			} else {
				let isEmpty = true;

				for (let p in cur) {
					isEmpty = false;
					recurse(cur[p], prop ? prop + '.' + p : p);
				}

				if (isEmpty && prop) {
					result[prop] = {};
				}
			}
		}
		recurse(data, '');
		return result;
	}

	objectIsEqual(orginalObject, comparisonObject) {
		let orginalString = JSON.stringify(orginalObject);
		let comparisonString = JSON.stringify(comparisonObject);

		if (orginalString === comparisonString) {
			return true;
		} else {
			return false;
		}
	}

	guid() {
		let d = new Date().getTime();
		let uuid = 'xxxxxxxxxxxxxaxxxxxxxxxxxxxxxxxxxx'.replace(
			/[x]/g,
			function (c) {
				let r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16);
			}
		);
		return uuid;
	}

	capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	formatAmount(amount) {
		let parseAmount;

		parseAmount = parseFloat(amount.toString().replace(',', '.'));

		if (isNaN(parseAmount) || parseAmount < 0.01) {
			return 0;
		} else {
			return parseFloat(amount.toString().replace(',', '.'));
		}
	}

	formatUseGas(useGas) {
		if (useGas !== 'true' && useGas !== 'false') {
			return null;
		} else {
			return useGas;
		}
	}

	formatAddress(address) {
		if (address === null) {
			return null;
		}

		address = address.trim();
		address = address.replace(/[^a-zA-Z0-9]/g, '');

		if (address === '' || address.length !== 64) {
			return null;
		} else {
			return address;
		}
	}

	formatFirstName(firstName) {
		if (!firstName) {
			return '';
		}

		firstName = firstName.trim();

		if (firstName === '') {
			return '';
		} else {
			return firstName;
		}
	}

	formatFamilyName(familyName) {
		if (!familyName) {
			return '';
		}

		familyName = familyName.trim();

		if (familyName === '') {
			return '';
		} else {
			return familyName;
		}
	}

	validateAmount(amount) {
		if (
			amount === '' ||
			parseFloat(amount.toString().replace(',', '.')) === 0 ||
			isNaN(parseFloat(amount.toString().replace(',', '.')))
		) {
			return false;
		} else {
			return true;
		}
	}

	validateAddress(address) {
		if (address === null) {
			return false;
		}

		address = address.trim();
		address = address.replace(/[^a-zA-Z0-9]/g, '');

		if (address === '' || address.length !== 64) {
			return false;
		} else {
			return true;
		}
	}

	getCookieValue(cookieName) {
		let a = `; ${document.cookie}`.match(`;\\s*${cookieName}=([^;]+)`);
		return a ? a[1] : '';
	}

	getSocialUrls(amount, shareUrl, shareType) {
		let shareText;
		let shareUrlTwitter;
		let shareUrlFacebook;
		let shareUrlWhatsApp;
		let shareUrlYelloSocial;

		if (shareType === 'share') {
			shareText = 'Click here to see my giveaway on Yello: ';
		}

		if (shareType === 'receive') {
			if (this.validateAmount(amount) === false) {
				shareText = 'Click here to view my Yello wallet address: ';
			} else {
				shareText = 'Click here to view my payment request on Yello: ';
			}
		}

		shareUrlFacebook =
			'https://www.facebook.com/sharer/sharer.php?u=' + escape(shareUrl);

		shareUrlWhatsApp =
			'https://api.whatsapp.com/send?text=' +
			escape(shareText + ' ' + shareUrl);

		shareUrlTwitter =
			'https://twitter.com/intent/tweet?url=' +
			escape(shareUrl) +
			'&text=' +
			escape(shareText);

		shareUrlYelloSocial = shareUrl;

		return {
			shareUrlTwitter,
			shareUrlFacebook,
			shareUrlWhatsApp,
			shareUrlYelloSocial,
		};
	}

	clearPromises(promises) {
		for (let key in promises) {
			promises[key].resolve();
			delete promises[key];
		}
	}

	validateEmail(email) {
		let filter = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
		let result = filter.test(email);
		return result;
	}

	validateBaerer(authenticationBearer) {
		let decodedBaerer;
		let currentCookieDate = new Date().getTime() / 1000;

		if (!authenticationBearer) {
			return false;
		}

		decodedBaerer = this.decodeAuthenticationBearer(authenticationBearer);

		if (
			decodedBaerer &&
			decodedBaerer.exp &&
			decodedBaerer.exp >= currentCookieDate
		) {
			return true;
		} else {
			return false;
		}
	}

	decodeAuthenticationBearer(authenticationBearer) {
		let decodedString;
		let tokenArray = authenticationBearer.split('.');

		if (tokenArray.length !== 3) {
			return null;
		}

		decodedString = window.atob(
			tokenArray[1].replace('-', '+').replace('_', '/')
		);

		try {
			return JSON.parse(decodedString);
		} catch (e) {
			return null;
		}
	}

	getSearch() {
		const location = window.location;

		if (!location.search || location.search === '') {
			return {};
		}

		if (location.search && location.search !== '') {
			return querystring.decode(location.search.replace('?', ''));
		}
	}

	simpleHash(str, seed = 0) {
		let h1 = 0xdeadbeef ^ seed,
			h2 = 0x41c6ce57 ^ seed;
		for (let i = 0, ch; i < str.length; i++) {
			ch = str.charCodeAt(i);
			h1 = Math.imul(h1 ^ ch, 2654435761);
			h2 = Math.imul(h2 ^ ch, 1597334677);
		}
		h1 =
			Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
			Math.imul(h2 ^ (h2 >>> 13), 3266489909);
		h2 =
			Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
			Math.imul(h1 ^ (h1 >>> 13), 3266489909);
		return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
	}

	generateURL(url) {
		let dl = document.location;
		if (!url) {
			throw new Error('url not provided');
		}

		if (!(url.indexOf('?') === -1 && url.indexOf('#') === -1)) {
			throw new Error('basic url not given');
		}

		if (url.indexOf('//') === 0) {
			url = dl.protocol + url;
		}

		if (url.indexOf('/') === 0) {
			url = dl.protocol + '//' + dl.host + url;
		}

		url = url.replace(/[/]+$/, '');
		return url;
	}

	generateLocation(path) {
		let match;

		match = path.match(this.pathRegex);

		return (
			match && {
				pathname: match[1],
				search: match[2],
				hash: match[3],
			}
		);
	}

	formatRoutePath(path) {
		let count;

		if (path === '/') {
			return path;
		}

		count = path.length;

		if (path.substring(0, 1) !== '/') {
			path = '/' + path;
		}

		if (path.substring(count - 1, count) !== '/') {
			return path;
		} else {
			return path.substring(0, count - 1);
		}
	}

	generateRoutePath(path) {
		let newPath;
		let pathArray;

		newPath = this.formatRoutePath(path);
		pathArray = newPath.split('/');

		return '/' + pathArray[1];
	}

	generatePunkIdFromPath(path) {
		let newPath;
		let pathArray;

		newPath = this.formatRoutePath(path);
		pathArray = newPath.split('/');

		return pathArray[2];
	}

	getTransformValues3D(value) {
		let i;
		let arrayCount;

		let values;
		let valueArray = [];
		let numericValueArray = [];

		if (typeof value === 'string' || value instanceof String) {
			values = value.split(/\w+\(|\);?/);
		} else {
			values = value.style[this.transformProperty].split(/\w+\(|\);?/);
		}

		if (!values[1] || !values[1].length) {
			return [];
		} else {
			valueArray = values[1].split(/,\s?/g);
			for (i = 0, arrayCount = valueArray.length; i < arrayCount; i++) {
				numericValueArray.push(
					parseInt(valueArray[i].replace('px', ''), 10)
				);
			}

			return numericValueArray;
		}
	}

	initializePathRegex() {
		return new RegExp(
			[
				'(/{0,1}[^?#]*)', // pathname
				'(\\?[^#]*|)', // search
				'(#.*|)$', // hash
			].join('')
		);
	}

	addDebouncer(callback) {
		const vm = this;

		return new Debouncer(callback);

		function Debouncer(callback) {
			var self = this;

			var loop;

			this.ticking = false;
			this.callback = callback;

			this.handleEvent = (event) => {
				self.requestTick(event);
			};

			this.update = (event) => {
				self.callback && self.callback(event);
				self.ticking = false;
			};

			this.clear = () => {
				if (loop) {
					vm.animationClearFrame(loop);
				}
			};

			this.requestTick = (event) => {
				if (!self.ticking) {
					loop = vm.animationFrame(() => {
						if (self.rafCallback) {
							self.rafCallback(event);
						} else {
							self.rafCallback = self.update;
							self.rafCallback(event);
						}
					});

					self.ticking = true;
				}
			};
		}
	}

	setTransitionTimeout(className, transitionElement, transitionTimeout) {
		setTimeout(() => {
			$(className).removeClass(transitionElement);
		}, transitionTimeout);
	}

	initializeBrowserSupport() {
		let location;
		let supportObject = {};

		location = window.location;

		supportObject.language = language();
		supportObject.deviceOS = deviceOS();
		supportObject.userMedia = userMedia();
		supportObject.mobileDevice = mobileDevice();
		supportObject.flexCalculate = flexCalculate();
		supportObject.parallaxCapable = parallaxCapable();

		function language() {
			return window.navigator.language;
		}

		function userMedia() {
			if (!navigator.mediaDevices) {
				return false;
			} else {
				if (location.href.indexOf('localhost') !== -1) {
					return true;
				} else {
					if (location.href.indexOf('https://') === -1) {
						return false;
					} else {
						return true;
					}
				}
			}
		}

		function deviceOS() {
			let os;
			if (navigator.userAgent.match(/(android)/gi)) {
				os = 'android';
			}

			if (navigator.userAgent.match(/(iphone|ipad|ipod)/gi)) {
				os = 'ios';
			}

			if (!os) {
				os = 'desktop';
			}

			return os;
		}

		function mobileDevice() {
			if (
				navigator.userAgent.match(
					/(iphone|ipad|ipod|android|windows phone)/gi
				)
			) {
				return true;
			} else {
				return false;
			}
		}

		function flexCalculate() {
			return !!window.MSInputMethodContext && !!document.documentMode;
		}

		function parallaxCapable() {
			let versionIOS;
			let versionAND;

			const minVersionIOS = 11;
			const minVersionAND = 8;

			if (
				navigator.userAgent.match(
					/(iphone|ipad|ipod|android|windows phone)/gi
				) === null
			) {
				return true;
			} else {
				if (
					navigator.userAgent.match(/android\s([0-9\.]*)/i) !== null
				) {
					versionAND = +navigator.userAgent
						.match(/android\s([0-9\.]*)/i)[0]
						.replace('Android ', '')
						.split('.')[0];

					if (versionAND >= minVersionAND) {
						return true;
					} else {
						return false;
					}
				}

				if (
					navigator.userAgent.match(/OS (\d)?\d_\d(_\d)?/i) !== null
				) {
					versionIOS = +navigator.userAgent
						.match(/OS (\d)?\d_\d(_\d)?/i)[0]
						.replace('_', '.')
						.replace('_', '')
						.replace('OS ', '')
						.split('.')[0];

					if (versionIOS >= minVersionIOS) {
						return true;
					} else {
						return false;
					}
				}

				return false;
			}
		}

		window.browserSupport = supportObject;
		return supportObject;
	}

	detectTransformProperty() {
		let a;
		let el = document.createElement('t-element');

		let transforms = {
			transform: 'transform',
			oTransform: 'oTransform',
			MozAnimation: 'mozTransform',
			webkitTransform: 'webkitTransform',
		};

		for (a in transforms) {
			if (el.style[a] !== undefined) {
				return transforms[a];
			}
		}
	}

	detectTransitionProperty() {
		let a;
		let el = document.createElement('t-element');

		let transitions = {
			transition: 'transition',
			oTransition: 'oTransition',
			mozTransition: 'mozTransition',
			webkitTransition: 'webkitTransition',
		};

		for (a in transitions) {
			if (el.style[a] !== undefined) {
				return transitions[a];
			}
		}
	}

	detectAnimationEndProperty() {
		let a;
		let el = document.createElement('ae-element');

		let animations = {
			animation: 'animationend',
			OAnimation: 'oAnimationEnd',
			MozAnimation: 'mozAnimationEnd',
			WebkitAnimation: 'webkitAnimationEnd',
		};

		for (a in animations) {
			if (el.style[a] !== undefined) {
				return animations[a];
			}
		}
	}

	detectTransitionEndProperty() {
		let t;
		let el = document.createElement('te-element');
		let transitions = {
			transition: 'transitionend',
			OTransition: 'oTransitionEnd',
			MozTransition: 'transitionend',
			WebkitTransition: 'webkitTransitionEnd',
		};

		for (t in transitions) {
			if (el.style[t] !== undefined) {
				return transitions[t];
			}
		}
	}

	getStyle(domElement, styleProp) {
		let propertyValue;

		if (getComputedStyle) {
			propertyValue = getComputedStyle(domElement, null).getPropertyValue(
				styleProp
			);
		} else if (domElement.currentStyle) {
			propertyValue = domElement.currentStyle[styleProp];
		}

		return propertyValue;
	}

	detectAnimationFrame() {
		if (window.requestAnimationFrame) {
			return window.requestAnimationFrame.bind(window);
		}

		if (window.webkitRequestAnimationFrame) {
			return window.webkitRequestAnimationFrame.bind(window);
		}

		if (window.webkitRequestAnimationFrame) {
			return window.webkitRequestAnimationFrame.bind(window);
		}

		if (window.msRequestAnimationFrame) {
			return window.msRequestAnimationFrame.bind(window);
		}

		if (
			window.mozRequestAnimationFrame &&
			window.mozCancelRequestAnimationFrame
		) {
			return window.mozRequestAnimationFrame.bind(window);
		}

		return;
	}

	detectAnimationClearFrame() {
		if (window.cancelAnimationFrame) {
			return window.cancelAnimationFrame.bind(window);
		}

		if (window.webkitCancelAnimationFrame) {
			return window.webkitCancelAnimationFrame.bind(window);
		}

		if (window.webkitCancelRequestAnimationFrame) {
			return window.webkitCancelRequestAnimationFrame.bind(window);
		}

		if (window.oCancelRequestAnimationFrame) {
			return window.oCancelRequestAnimationFrame.bind(window);
		}

		if (window.msCancelRequestAnimationFrame) {
			return window.msCancelRequestAnimationFrame.bind(window);
		}

		if (window.mozCancelRequestAnimationFrame) {
			return window.mozCancelRequestAnimationFrame.bind(window);
		}

		return;
	}

	setAnimationFrameTimeout(fn, delay) {
		let handle;
		let startTimeLoop;

		if (!Instance.animationFrame) {
			return window.setTimeout(fn, delay);
		} else {
			handle = {};
			startTimeLoop = new Date().getTime();

			handle.clear = false;
			handle.value = Instance.animationFrame(loop);
			return handle;
		}

		function loop() {
			let current = new Date().getTime();
			let delta = current - startTimeLoop;

			if (delta >= delay) {
				fn.call();
				Instance.clearAnimationFrameTimeout(handle);
			} else {
				if (handle.clear === true) {
					Instance.clearAnimationFrameTimeout(handle);
				} else {
					handle.value = Instance.animationFrame(loop);
				}
			}
		}
	}

	clearAnimationFrameTimeout(handle) {
		if (!handle) {
			return;
		}

		if (!Instance.animationFrame) {
			window.clearTimeout(handle);
		} else {
			handle.clear = true;
			Instance.animationClearFrame(handle.value);
		}
	}

	setAnimationFrameInterval(fn, delay) {
		let handle;
		let startTimeLoop;

		if (!Instance.animationFrame) {
			return window.setInterval(fn, delay);
		} else {
			handle = {};
			startTimeLoop = new Date().getTime();

			handle.clear = false;
			handle.value = Instance.animationFrame(loop);

			return handle;
		}

		function loop() {
			let current = new Date().getTime();
			let delta = current - startTimeLoop;

			if (delta >= delay) {
				fn.call();
				startTimeLoop = new Date().getTime();
			}

			if (handle.clear === true) {
				Instance.clearAnimationFrameInterval(handle);
			} else {
				handle.value = Instance.animationFrame(loop);
			}
		}
	}

	clearAnimationFrameInterval(handle) {
		if (!handle) {
			return;
		}

		if (!Instance.animationFrame) {
			window.clearInterval(handle);
		} else {
			handle.clear = true;
			Instance.animationClearFrame(handle.value);
		}
	}

	addObjectEventDispatcher(eventObject) {
		eventObject.addObjectEventListener = function addObjectEventListener(
			key,
			guid,
			listenerMethod
		) {
			if (!listenerMethod) {
				console.warn('Listener method not undefined');
				return;
			}

			if (!eventObject.eventListeners[key]) {
				eventObject.eventListeners[key] = [];
			}

			eventObject.eventListeners[key].push({
				guid: guid,
				listenerMethod: listenerMethod,
				listenerMethodName: listenerMethod.name,
			});
		};

		eventObject.removeAllEventListeners = function removeAllEventListeners() {
			let key;

			for (key in eventObject.eventListeners) {
				delete eventObject.eventListeners[key];
			}

			eventObject.eventListeners = {};
		};

		eventObject.dispatchObjectEvent = function dispatchObjectEvent() {
			let i;
			let key;
			let arrayCount;

			let fuzzyString;
			let listenerArray;
			let argumentsArray = arguments;

			let functionArgumentsArray = Array.prototype.slice.call(
				argumentsArray,
				1
			);

			if (
				argumentsArray[0].indexOf('*') === -1 &&
				eventObject.eventListeners[argumentsArray[0]]
			) {
				listenerArray =
					eventObject.eventListeners[argumentsArray[0]] || [];
				for (
					i = 0, arrayCount = listenerArray.length;
					i < arrayCount;
					i++
				) {
					listenerArray[i].listenerMethod.apply(
						this,
						functionArgumentsArray
					);
				}
			}

			if (argumentsArray[0].indexOf('*') !== -1) {
				fuzzyString = argumentsArray[0].split('*')[0];

				for (key in eventObject.eventListeners) {
					if (fuzzyString === key.substring(0, fuzzyString.length)) {
						listenerArray = eventObject.eventListeners[key] || [];
						for (
							i = 0, arrayCount = listenerArray.length;
							i < arrayCount;
							i++
						) {
							listenerArray[i].listenerMethod.apply(
								this,
								functionArgumentsArray
							);
						}
					}
				}
			}
		};

		eventObject.removeObjectEventListener = function removeObjectEventListener(
			key,
			guid,
			listenerMethod
		) {
			let i;
			let objectKey;
			let arrayCount;

			let methodArray;
			let fuzzyString;

			let newMethodArray = [];

			if (key.indexOf('*') === -1) {
				methodArray = eventObject.eventListeners[key] || [];

				for (
					i = 0, arrayCount = methodArray.length;
					i < arrayCount;
					i++
				) {
					if (guid !== methodArray[i].guid) {
						newMethodArray.push(methodArray[i]);
					} else {
						delete methodArray[i].component;

						delete methodArray[i].listenerMethod;
						delete methodArray[i].listenerMethodName;
					}
				}

				eventObject.eventListeners[key] = newMethodArray;
			}

			if (key.indexOf('*') !== -1) {
				fuzzyString = key.split('*')[0];
				for (objectKey in eventObject.eventListeners) {
					if (
						fuzzyString ===
						objectKey.substring(0, fuzzyString.length)
					) {
						methodArray =
							eventObject.eventListeners[objectKey] || [];

						for (
							i = 0, arrayCount = methodArray.length;
							i < arrayCount;
							i++
						) {
							if (guid !== methodArray[i].guid) {
								newMethodArray.push(methodArray[i]);
							} else {
								delete methodArray[i].component;

								delete methodArray[i].listenerMethod;
								delete methodArray[i].listenerMethodName;
							}
						}

						eventObject.eventListeners[key] = newMethodArray;
					}
				}
			}
		};

		eventObject.eventListeners = {};
		eventObject.on = eventObject.addObjectEventListener;
		eventObject.off = eventObject.removeObjectEventListener;
	}
}

export default UtilityService;
