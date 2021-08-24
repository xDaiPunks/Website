const React = require('react');

class ReactClick {
	constructor() {
		this.initializeClick();
	}

	initializeClick() {
		let TOUCH_DELAY = 1000;
		let MOVE_THRESHOLD = 8;

		let touchKeysToStore = [
			'clientX',
			'clientY',
			'pageX',
			'pageY',
			'screenX',
			'screenY',
			'radiusX',
			'radiusY',
		];

		let touchEvents = {
			downPos: {},
			lastPos: {},
		};

		let originalCreateElement = React.createElement;

		let handleType = {
			input: event => {
				focus(event);
				event.stopPropagation();
			},
			textarea: event => {
				focus(event);
				event.stopPropagation();
			},
			select: event => {
				focus(event);
				event.stopPropagation();
			},
			label: event => {
				let input;

				let forTarget = event.currentTarget.getAttribute('for');

				if (forTarget) {
					input = document.getElementById(forTarget);
				} else {
					input = event.currentTarget.querySelectorAll(
						'input, textarea, select'
					)[0];
				}

				if (input) {
					focus(event, input);
				}
			},
		};

		function isDisabled(element) {
			if (!element) {
				return false;
			}
			let disabled = element.getAttribute('disabled');

			return disabled !== false && disabled !== null;
		}

		function focus(event, target) {
			let myTarget = target || event.currentTarget;

			if (!myTarget || isDisabled(myTarget)) {
				return;
			}

			myTarget.focus();
		}

		function fakeClickEvent(event) {
			if (typeof event.persist === 'function') {
				event.persist();
			}

			event.fastclick = true;
			event.type = 'click';
			event.button = 0;
		}

		function copyTouchKeys(touch, target) {
			if (typeof target.persist === 'function') {
				target.persist();
			}

			if (touch) {
				for (let i = 0; i < touchKeysToStore.length; i += 1) {
					let key = touchKeysToStore[i];
					target[key] = touch[key];
				}
			}
		}

		function noTouchHappened() {
			return (
				!touchEvents.touched &&
				(!touchEvents.lastTouchDate ||
					new Date().getTime() > touchEvents.lastTouchDate + TOUCH_DELAY)
			);
		}

		function invalidateIfMoreThanOneTouch(event) {
			touchEvents.invalid =
				(event.touches && event.touches.length > 1) || touchEvents.invalid;
		}

		function onMouseEvent(callback, event) {
			let touched = !noTouchHappened();

			// Prevent mouse events on other elements
			if (touched && event.target !== touchEvents.target) {
				event.preventDefault();
			}

			// Prevent any mouse events if we touched recently
			if (typeof callback === 'function' && !touched) {
				callback(event);
			}

			if (event.type === 'click') {
				touchEvents.invalid = false;
				touchEvents.touched = false;
				touchEvents.moved = false;
			}
		}

		function onTouchStart(callback, event) {
			touchEvents.invalid = false;
			touchEvents.moved = false;
			touchEvents.touched = true;
			touchEvents.target = event.target;
			touchEvents.lastTouchDate = new Date().getTime();

			copyTouchKeys(event.touches[0], touchEvents.downPos);
			copyTouchKeys(event.touches[0], touchEvents.lastPos);

			invalidateIfMoreThanOneTouch(event);

			if (typeof callback === 'function') {
				callback(event);
			}
		}

		function onTouchMove(callback, event) {
			touchEvents.touched = true;
			touchEvents.lastTouchDate = new Date().getTime();

			copyTouchKeys(event.touches[0], touchEvents.lastPos);

			invalidateIfMoreThanOneTouch(event);

			if (
				Math.abs(touchEvents.downPos.clientX - touchEvents.lastPos.clientX) >
					MOVE_THRESHOLD ||
				Math.abs(touchEvents.downPos.clientY - touchEvents.lastPos.clientY) >
					MOVE_THRESHOLD
			) {
				touchEvents.moved = true;
			}

			if (typeof callback === 'function') {
				callback(event);
			}
		}

		function onTouchEnd(callback, onClick, type, event) {
			touchEvents.touched = true;
			touchEvents.lastTouchDate = new Date().getTime();

			invalidateIfMoreThanOneTouch(event);

			if (typeof callback === 'function') {
				callback(event);
			}

			if (!touchEvents.invalid && !touchEvents.moved) {
				let box = event.currentTarget.getBoundingClientRect();

				if (
					touchEvents.lastPos.clientX - (touchEvents.lastPos.radiusX || 0) <=
						box.right &&
					touchEvents.lastPos.clientX + (touchEvents.lastPos.radiusX || 0) >=
						box.left &&
					touchEvents.lastPos.clientY - (touchEvents.lastPos.radiusY || 0) <=
						box.bottom &&
					touchEvents.lastPos.clientY + (touchEvents.lastPos.radiusY || 0) >=
						box.top
				) {
					if (!isDisabled(event.currentTarget)) {
						if (typeof onClick === 'function') {
							copyTouchKeys(touchEvents.lastPos, event);
							fakeClickEvent(event);
							onClick(event);
						}

						if (!event.defaultPrevented && handleType[type]) {
							handleType[type](event);
						}
					}
				}
			}
		}

		function propsWithFastclickEvents(type, props) {
			let newProps = {};

			// Loop over props
			for (let key in props) {
				// Copy props to newProps
				newProps[key] = props[key];
			}

			// Apply our wrapped mouse and touch handlers
			newProps.onClick = onMouseEvent.bind(null, props.onClick);
			newProps.onMouseDown = onMouseEvent.bind(null, props.onMouseDown);
			newProps.onMouseMove = onMouseEvent.bind(null, props.onMouseMove);
			newProps.onMouseUp = onMouseEvent.bind(null, props.onMouseUp);
			newProps.onTouchStart = onTouchStart.bind(null, props.onTouchStart);
			newProps.onTouchMove = onTouchMove.bind(null, props.onTouchMove);
			newProps.onTouchEnd = onTouchEnd.bind(
				null,
				props.onTouchEnd,
				props.onClick,
				type
			);

			if (typeof Object.freeze === 'function') {
				Object.freeze(newProps);
			}

			return newProps;
		}

		React.createElement = function() {
			// Convert arguments to array
			let args = Array.prototype.slice.call(arguments);

			let type = args[0];
			let props = args[1];

			// Check if basic element & has onClick prop
			if (
				type &&
				typeof type === 'string' &&
				((props && typeof props.onClick === 'function') || handleType[type])
			) {
				// Add our own events to props
				args[1] = propsWithFastclickEvents(type, props || {});
			}

			// Apply args to original createElement function
			return originalCreateElement.apply(null, args);
		};

		if (typeof React.DOM === 'object') {
			for (let key in React.DOM) {
				React.DOM[key] = React.createElement.bind(null, key);
			}
		}
	}
}

export default ReactClick;
