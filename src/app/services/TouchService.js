import EventService from 'src/app/services/EventService';

let Instance;

let elementArray = [];

const moveRadius = 10;

const pointerEvents = {
	mouse: {
		start: 'mousedown',
		move: 'mousemove',
		end: 'mouseup'
	},
	touch: {
		start: 'touchstart',
		move: 'touchmove',
		end: 'touchend',
		cancel: 'touchcancel'
	},
	pointer: {
		start: 'pointerdown',
		move: 'pointermove',
		end: 'pointerup',
		cancel: 'pointercancel'
	}
};

const eventService = new EventService();

const getCoordinates = event => {
	let originalEvent = event.originalEvent || event;
	let touches = originalEvent.touches && originalEvent.touches.length ? originalEvent.touches : [originalEvent];
	let e = (originalEvent.changedTouches && originalEvent.changedTouches[0]) || touches[0];

	return {
		x: e.clientX,
		y: e.clientY
	};
};

const getEvents = (pointerTypes, eventType) => {
	let eventName;
	let resultArray = [];

	pointerTypes.forEach((element, index, array) =>{
		eventName = pointerEvents[element][eventType];
		if (eventName) {
			resultArray.push(eventName);
		}
	});

	return resultArray.join(' ');
};



class TouchService {
	constructor() {
		if (!Instance) {
			Instance = this;
		}
		return Instance;
	}

	bind(identifier, eventHandlers, pointerTypes) {
		let totalX;
		let totalY;
		let startCoords;
		let lastPos;
		let events;
		let active = false;

		let element = $(identifier);

		if (element.length === 0) {
			return;
		}

		pointerTypes = pointerTypes || ['mouse', 'touch', 'pointer'];

		element.on(getEvents(pointerTypes, 'start'), event => {
			startCoords = getCoordinates(event);
			active = true;
			totalX = 0;
			totalY = 0;
			lastPos = startCoords;
			if (eventHandlers['start']) {
				eventHandlers['start'](startCoords, event);
			}
		});

		elementArray.push({
			element: element,
			eventString: getEvents(pointerTypes, 'start')
		})

		events = getEvents(pointerTypes, 'cancel');

		if (events) {
			element.on(events, event => {
				active = false;
				if (eventHandlers['cancel']) {
					eventHandlers['cancel'](event);
				}
			});

			elementArray.push({
				element: element,
				eventString: events
			});
		}

		element.on(getEvents(pointerTypes, 'move'), event => {
			if (!active) return;

			// Android will send a touchcancel if it thinks we're starting to scroll.
			// So when the total distance (+ or - or both) exceeds 10px in either direction,
			// we either:
			// - On totalX > totalY, we send preventDefault() and treat this as a swipe.
			// - On totalY > totalX, we let the browser handle it as a scroll.

			if (!startCoords) return;
			let coords = getCoordinates(event);

			totalX += Math.abs(coords.x - lastPos.x);
			totalY += Math.abs(coords.y - lastPos.y);

			lastPos = coords;

			if (totalX < moveRadius && totalY < moveRadius) {
				return;
			}

			// One of totalX or totalY has exceeded the buffer, so decide on swipe vs. scroll.
			if (totalY > totalX) {
				// Allow native scrolling to take over.
				active = false;
				if (eventHandlers['cancel']) {
					eventHandlers['cancel'](event);
				}
				return;
			} else {
				// Prevent the browser from scrolling.
				// event.preventDefault();
				if (eventHandlers['move']) {
					eventHandlers['move'](coords, event);
				}
			}
		});

		elementArray.push({
			element: element,
			eventString: getEvents(pointerTypes, 'move')
		});

		element.on(getEvents(pointerTypes, 'end'), event => {
			if (!active) return;
			active = false;
			if (eventHandlers['end']) {
				eventHandlers['end'](getCoordinates(event), event);
			}
		});

		elementArray.push({
			element: element,
			eventString: getEvents(pointerTypes, 'end')
		});
	}

	addSwipe() {
		let valid;

		let swipeAction;
		let startCoordinates;

		let minHorizontalDistance = 150;

		this.bind(
			document,
			{
				cancel: function(event) {
					valid = false;
				},
				start: function(coords, event) {
					valid = true;
					startCoordinates = coords;
				},
				end: function(coords, event) {
					swipeAction = getSwipeAction(coords);
					if (swipeAction === 'swipe-left' || swipeAction === 'swipe-right') {
						eventService.dispatchObjectEvent('navigation:swipe-action', {
							swipeAction: swipeAction,
							startCoordinates: startCoordinates
						});
					}
				}
			},
			['touch', 'mouse']
		);

		const getSwipeAction = coords => {
			var deltaX;

			if (!startCoordinates) {
				return 'no-swipe';
			}

			deltaX = coords.x - startCoordinates.x;

			if (!valid || Math.abs(deltaX) <= 0 || Math.abs(deltaX) < minHorizontalDistance) {
				return 'no-swipe';
			} else {
				if (deltaX > 0) {
					return 'swipe-right';
				}

				if (deltaX < 0) {
					return 'swipe-left';
				}
			}
		};
	}

	removeSwipe() {
		let i;
		let arrayCount;

		let documentElement = $(document);
		
		if (documentElement.length === 0) {
			return;
		}

		for(i = 0, arrayCount = elementArray.length; i < arrayCount; i++) {
			if(elementArray[i].element) {
				elementArray[i].element.off(elementArray[i].eventString);	
			}
			
		}
	}
}

export default TouchService;
