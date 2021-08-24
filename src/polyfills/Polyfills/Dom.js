// Remove polyfill
(function (arr) {
	arr.forEach(function (item) {
		if (item.hasOwnProperty('remove')) {
			return;
		}
		Object.defineProperty(item, 'remove', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function remove() {
				if (this.parentNode === null) {
					return;
				}
				this.parentNode.removeChild(this);
			},
		});
	});
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

// Prepend polyfill
(function (arr) {
	arr.forEach(function (item) {
		if (item.hasOwnProperty('prepend')) {
			return;
		}
		Object.defineProperty(item, 'prepend', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function prepend() {
				var argArr = Array.prototype.slice.call(arguments),
					docFrag = document.createDocumentFragment();

				argArr.forEach(function (argItem) {
					var isNode = argItem instanceof Node;
					docFrag.appendChild(
						isNode
							? argItem
							: document.createTextNode(String(argItem))
					);
				});

				this.insertBefore(docFrag, this.firstChild);
			},
		});
	});
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

/* @todo: fix the promise with second catch */
(function (window) {
	let dom = (selector, context) => {
		return new dom.Initialize(selector, context);
	};

	dom.deferred = () => {
		return new dom.Deferred();
	};

	dom.Deferred = class Deferred {
		constructor() {
			let vm = this;

			this.deferredPromise = new Promise((resolve, reject) => {
				vm.promiseReject = reject;
				vm.promiseResolve = resolve;
			});

			this.then = this.deferredPromise.then.bind(this.deferredPromise);
			this.catch = this.deferredPromise.catch.bind(this.deferredPromise);

			this.promise = () => {
				return vm.deferredPromise;
			};

			this.resolve = (response) => {
				vm.promiseResolve(response);
			};

			this.reject = (reason) => {
				if (vm.fail) {
					vm.fail(reason);
				}
				/* rework
				if (vm.promiseReject) {
					vm.promiseReject(reason);
				}
				*/
			};

			this.deferredPromise.fail = (rejectMethod) => {
				vm.fail = rejectMethod;
			};
		}
	};

	dom.Initialize = class Initialize {
		constructor(selector, context) {
			this.elements = [];

			this.on = this.on.bind(this);
			this.off = this.off.bind(this);

			this.val = this.val.bind(this);
			this.html = this.html.bind(this);

			this.css = this.css.bind(this);
			this.find = this.find.bind(this);
			this.offset = this.offset.bind(this);
			this.hasClass = this.hasClass.bind(this);

			this.width = this.width.bind(this);
			this.height = this.height.bind(this);

			this.addClass = this.addClass.bind(this);
			this.removeClass = this.removeClass.bind(this);

			return this.getDecoratedDomNodes(selector, context);
		}

		on(type, listener, options) {
			let i;
			let j;

			let arrayCountI;
			let arrayCountJ;

			let typeArray;
			let elements = this.elements;

			if (!type) {
				return;
			}

			typeArray = type.split(' ');

			for (i = 0, arrayCountI = elements.length; i < arrayCountI; i++) {
				elements[i].events = elements[i].events || {};

				for (
					j = 0, arrayCountJ = typeArray.length;
					j < arrayCountJ;
					j++
				) {
					if (!elements[i].events[typeArray[j]]) {
						elements[i].events[typeArray[j]] = [];
						elements[i].events[typeArray[j]].push(listener);
					} else {
						elements[i].events[typeArray[j]].push(listener);
					}

					if (!options) {
						elements[i].addEventListener(typeArray[j], listener);
					} else {
						elements[i].addEventListener(
							typeArray[j],
							listener,
							options
						);
					}
				}
			}
		}

		off(type, listener, options) {
			let i;
			let j;
			let k;

			let arrayCountI;
			let arrayCountJ;
			let arrayCountK;

			let events;
			let typeArray;
			let elements = this.elements;

			if (!type) {
				return;
			}

			typeArray = type.split(' ');

			for (i = 0, arrayCountI = elements.length; i < arrayCountI; i++) {
				if (listener === undefined) {
					for (
						k = 0, arrayCountK = typeArray.length;
						k < arrayCountK;
						k++
					) {
						if (
							elements[i].events &&
							elements[i].events[typeArray[k]]
						) {
							events = elements[i].events[typeArray[k]];

							for (
								j = 0, arrayCountJ = events.length;
								j < arrayCountJ;
								j++
							) {
								if (events[j]) {
									elements[i].removeEventListener(
										typeArray[k],
										events[j]
									);
									events.splice(j, 1);
								}
							}
						}
					}
				}

				if (listener !== undefined) {
					for (
						k = 0, arrayCountK = typeArray.length;
						k < arrayCountK;
						k++
					) {
						if (
							elements[i].events &&
							elements[i].events[typeArray[k]]
						) {
							events = elements[i].events[typeArray[k]];

							for (
								j = 0, arrayCountJ = events.length;
								j < arrayCountJ;
								j++
							) {
								if (!listener.name || listener.name === '') {
									if (events[j]) {
										elements[i].removeEventListener(
											typeArray[k],
											events[j]
										);
										events.splice(j, 1);
									}
								} else {
									if (events[j]) {
										if (listener.name === events[j].name) {
											elements[i].removeEventListener(
												typeArray[k],
												events[j]
											);
											events.splice(j, 1);
										}
									}
								}
							}
						}
					}
				}
			}
		}

		hasClass(selectorName) {
			let elements = this.elements;

			return elements[0].classList.contains(selectorName);
		}

		addClass(selectorName) {
			let i;
			let arrayCount;

			let elements = this.elements;

			for (i = 0, arrayCount = elements.length; i < arrayCount; i++) {
				elements[i].classList.add(selectorName);
			}
		}

		removeClass(selectorName) {
			let i;
			let arrayCount;

			let elements = this.elements;

			for (i = 0, arrayCount = elements.length; i < arrayCount; i++) {
				elements[i].classList.remove(selectorName);
			}
		}

		html(htmlString) {
			let i;
			let arrayCount;
			let elements = this.elements;

			if (!htmlString) {
				return elements[0].innerHTML;
			}

			for (i = 0, arrayCount = elements.length; i < arrayCount; i++) {
				elements[i].innerHTML = htmlString;
			}
		}

		width() {
			let element;
			let computedStyle;
			let propertyValue;

			if (this.elements.length === 0) {
				return 0;
			}

			element = this.elements[0];

			computedStyle = window.getComputedStyle(element, null);
			propertyValue = computedStyle.getPropertyValue('width');

			if (propertyValue === '') {
				return 0;
			} else {
				return parseFloat(propertyValue);
			}
		}

		height() {
			let element;
			let computedStyle;
			let propertyValue;

			if (this.elements.length === 0) {
				return 0;
			}

			element = this.elements[0];

			computedStyle = window.getComputedStyle(element, null);
			propertyValue = computedStyle.getPropertyValue('height');

			if (propertyValue === '') {
				return 0;
			} else {
				return parseFloat(propertyValue);
			}
		}

		val(value) {
			let element;

			if (this.elements.length === 0) {
				return null;
			}

			if (this.elements.length > 0) {
				element = this.elements[0];
			}

			if (!value) {
				return element.value;
			} else {
				element.value = value;
			}
		}

		css(identifier, valueString) {
			let i;
			let arrayCount;

			let cssProperty;
			let elements = this.elements;

			if (identifier === null) {
				for (i = 0, arrayCount = elements.length; i < arrayCount; i++) {
					elements[i].removeAttribute('style');
				}
			}

			if (typeof identifier === 'string') {
				cssProperty = identifier.replace(/-([a-z])/g, (g) => {
					return g[1].toUpperCase();
				});

				if (!valueString && valueString !== '') {
					return window
						.getComputedStyle(elements[0], null)
						.getPropertyValue(identifier);
				} else {
					for (
						i = 0, arrayCount = elements.length;
						i < arrayCount;
						i++
					) {
						elements[i].style[cssProperty] = valueString;
					}
				}
			}

			if (typeof identifier === 'object') {
				for (let property in identifier) {
					cssProperty = property.replace(/-([a-z])/g, (g) => {
						return g[1].toUpperCase();
					});

					for (
						i = 0, arrayCount = elements.length;
						i < arrayCount;
						i++
					) {
						elements[i].style[cssProperty] = identifier[property];
					}
				}
			}
		}

		find(selectorName) {
			let i;
			let j;
			let k;

			let arrayCountI;
			let arrayCountJ;
			let arrayCountK;

			let equal;
			let element;

			let elementArray;
			let elementReturnArray;

			let elements = this.elements;

			elementReturnArray = [];

			for (i = 0, arrayCountI = elements.length; i < arrayCountI; i++) {
				elementArray = elements[i].querySelectorAll(selectorName);

				for (
					j = 0, arrayCountJ = elementArray.length;
					j < arrayCountJ;
					j++
				) {
					equal = false;
					element = elementArray[j];

					for (
						k = 0, arrayCountK = elementReturnArray.length;
						k < arrayCountK;
						k++
					) {
						if (element === elementReturnArray[k]) {
							equal = true;
							break;
						}
					}

					if (!equal) {
						elementReturnArray.push(element);
					}
				}
			}

			return dom(elementReturnArray);
		}

		offset() {
			let rect;
			let element;
			let ownerDocument;
			let documentElement;
			let documentWindow;

			if (this.elements.length === 0) {
				return;
			}

			element = this.elements[0];

			if (!element.getClientRects().length) {
				return;
			}

			rect = element.getBoundingClientRect();

			ownerDocument = element.ownerDocument;
			documentElement = ownerDocument.documentElement;

			documentWindow = ownerDocument.defaultView;

			return {
				top:
					rect.top +
					documentWindow.pageYOffset -
					documentElement.clientTop,
				left:
					rect.left +
					documentWindow.pageXOffset -
					documentElement.clientLeft,
			};
		}

		getDecoratedDomNodes(selector, context) {
			if (!selector) {
				return this.elements;
			}

			if (selector) {
				let elementArray;

				if (selector === document) {
					elementArray = [selector];
				}

				if (!elementArray && typeof selector === 'object') {
					elementArray = selector.length ? selector : [selector];
				}

				if (!elementArray && typeof selector === 'string') {
					elementArray = document.querySelectorAll(selector);
				}

				if (elementArray.length === 0) {
					return this.elements;
				}

				if (elementArray.length !== 0) {
					this.elements = elementArray;

					this.elements.on = this.on;
					this.elements.off = this.off;

					this.elements.val = this.val;
					this.elements.html = this.html;

					this.elements.css = this.css;
					this.elements.find = this.find;
					this.elements.offset = this.offset;
					this.elements.hasClass = this.hasClass;

					this.elements.width = this.width;
					this.elements.height = this.height;

					this.elements.addClass = this.addClass;
					this.elements.removeClass = this.removeClass;

					return this.elements;
				}
			}
		}
	};

	window.$ = dom;
})(window);
