import { scrollTo } from 'scroll-polyfill';

import EventService from 'src/app/services/EventService';
import UtilityService from 'src/app/services/UtilityService';

let Instance;

const eventService = new EventService();
const utilityService = new UtilityService();

class ScrollService {
	constructor() {
		if (!Instance) {
			Instance = this;

			Instance.moveY = null;
			Instance.scrollY = null;

			Instance.triggerElements = null;
			Instance.parallaxElements = null;

			Instance.scrollElement = null;
			Instance.scrollOriginalElement = null;

			Instance.guid = utilityService.guid();

			Instance.scrollTop = Instance.scrollTop.bind(this);

			Instance.calculateResize = Instance.calculateResize.bind(this);
			Instance.calculateScroll = Instance.calculateScroll.bind(this);

			Instance.scrollTrigger = Instance.scrollTrigger.bind(this);
			Instance.setScrollTriggers = Instance.setScrollTriggers.bind(this);
			Instance.removeScrollTriggers = Instance.removeScrollTriggers.bind(
				this
			);

			Instance.scrollParallax = Instance.scrollParallax.bind(this);
			Instance.setScrollParallax = Instance.setScrollParallax.bind(this);
			Instance.removeScrollParallax = Instance.removeScrollParallax.bind(
				this
			);

			Instance.calculateTouchMove = Instance.calculateTouchMove.bind(
				this
			);
			Instance.addScrollEventListeners = Instance.addScrollEventListeners.bind(
				this
			);

			Instance.addScrollEventListeners();
		}

		return Instance;
	}

	scrollTop() {
		scrollTo(window, { top: 0, behavior: 'auto' });
		scrollTo(this.scrollOriginalElement.scrollTop, {
			top: 0,
			behavior: 'auto',
		});
	}

	calculateResize(event) {
		this.calculateScroll();
	}

	calculateTouchMove(event) {
		this.calculateScroll(event);
	}

	calculateScroll(event) {
		let scrollY;

		const vm = this;

		scrollY = vm.scrollOriginalElement.scrollTop;

		if (scrollY !== vm.scrollY) {
			if (scrollY > vm.scrollY) {
				vm.moveY = 'down';
			} else {
				vm.moveY = 'up';
			}

			vm.scrollY = scrollY;

			vm.scrollTrigger();
			vm.scrollParallax();
		}
	}

	scrollTrigger() {
		let i;
		let y;

		let key;

		let arrayCount;
		let arrayCountY;

		let multiScrollCount;

		if (this.scrollY !== null) {
			for (
				i = 0, arrayCount = this.triggerElements.length;
				i < arrayCount;
				i++
			) {
				if (this.triggerElements[i].elementAddClass !== true) {
					if (
						this.scrollY > this.triggerElements[i].offsetArrayY[0]
					) {
						if (this.triggerElements[i].elementCSS) {
							for (key in this.triggerElements[i].elementCSS) {
								this.triggerElements[i].element[0].style[
									key
								] = this.triggerElements[i].elementCSS[key];
							}
						}
					} else {
						if (this.triggerElements[i].elementOrginalCSS) {
							for (key in this.triggerElements[i]
								.elementOrginalCSS) {
								this.triggerElements[i].element[0].style[
									key
								] = this.triggerElements[i].elementOrginalCSS[
									key
								];
							}
						}
					}
				}

				if (this.triggerElements[i].elementAddClass === true) {
					if (this.triggerElements[i].arrayCountY === 1) {
						if (
							this.scrollY >
							this.triggerElements[i].offsetArrayY[0]
						) {
							this.triggerElements[i].element.addClass('ScrollY');
						} else {
							this.triggerElements[i].element.removeClass(
								'ScrollY'
							);
						}
					}

					if (this.triggerElements[i].arrayCountY > 1) {
						multiScrollCount = 0;
						arrayCountY = this.triggerElements[i].arrayCountY;

						for (y = 0; y < arrayCountY; y++) {
							if (
								this.scrollY >
								this.triggerElements[i].offsetArrayY[y]
							) {
								multiScrollCount++;
							}
						}

						if (multiScrollCount % 2 !== 0) {
							this.triggerElements[i].element.addClass('ScrollY');
						} else {
							this.triggerElements[i].element.removeClass(
								'ScrollY'
							);
						}
					}
				}
			}
		}
	}

	setScrollTriggers(className, triggerObject) {
		let key;

		let i;
		let j;
		let y;

		let arrayCount;
		let arrayCountY;
		let arrayCountElement;

		let arrayY;
		let originalCSS;
		let offsetArrayY;

		let pageId;
		let element;
		let elementEqual;
		let elementEqualIndex;

		let elementAddClass;

		let elementCSS;
		let elementOrginalCSS;

		let elementOffsetArrayY;

		let elementCurrentTransfrom;
		let elementOriginalTransform;
		let elementTransformChangeValue;

		const vm = this;
		const elementArray = $(className);

		if (triggerObject) {
			pageId = triggerObject.pageId;

			elementOffsetArrayY = triggerObject.y;

			elementAddClass = triggerObject.addClass === true;

			if (triggerObject.css) {
				elementCSS = triggerObject.css;
			}
		}

		if (elementArray.length > 0) {
			for (i = 0, arrayCount = elementArray.length; i < arrayCount; i++) {
				element = $(elementArray[i]);

				if (element) {
					elementEqual = false;
					elementEqualIndex = null;

					for (
						j = 0, arrayCountElement = this.triggerElements.length;
						j < arrayCountElement;
						j++
					) {
						if (element[0] === this.triggerElements[j].element[0]) {
							elementEqual = true;
							elementEqualIndex = j;
						}
					}

					if (elementCSS && elementEqual === false) {
						elementOrginalCSS = {};
						for (key in elementCSS) {
							if (element[0].style[key] !== '') {
								elementOrginalCSS[key] = element[0].style[key];
							}
						}
					}

					if (
						!elementOffsetArrayY ||
						elementOffsetArrayY.length === 0
					) {
						arrayCountY = 1;

						if (element.offset().top === 0) {
							arrayY = [element.offset().top];
						} else {
							arrayY = [element.offset().top + vm.scrollY];
						}

						offsetArrayY = arrayY;
					} else {
						arrayY = [];

						arrayCountY = elementOffsetArrayY.length;

						elementTransformChangeValue = 0;

						if (elementEqual) {
							originalCSS = this.triggerElements[
								elementEqualIndex
							].elementOrginalCSS;

							if (
								originalCSS &&
								originalCSS.hasOwnProperty(
									utilityService.transformProperty
								)
							) {
								elementCurrentTransfrom = utilityService.getTransformValues3D(
									element[0]
								);
								elementOriginalTransform = utilityService.getTransformValues3D(
									originalCSS[
										utilityService.transformProperty
									]
								);

								if (
									elementCurrentTransfrom[1] !==
									elementOriginalTransform[1]
								) {
									elementTransformChangeValue =
										elementOriginalTransform[1] -
										elementCurrentTransfrom[1];
								}
							}
						}

						for (y = 0; y < arrayCountY; y++) {
							if (vm.scrollY > 0 && element.offset().top === 0) {
								arrayY.push(
									element.offset().top +
										elementOffsetArrayY[y] +
										elementTransformChangeValue
								);
							} else {
								arrayY.push(
									element.offset().top +
										vm.scrollY +
										elementOffsetArrayY[y] +
										elementTransformChangeValue
								);
							}
						}

						offsetArrayY = arrayY;
					}

					if (elementEqual === true) {
						this.triggerElements[
							elementEqualIndex
						].offsetArrayY = offsetArrayY;

						vm.scrollTrigger();
					} else {
						this.triggerElements.push({
							pageId: pageId,
							element: element,
							elementCSS: elementCSS,
							arrayCountY: arrayCountY,
							offsetArrayY: offsetArrayY,
							elementAddClass: elementAddClass,
							elementOrginalCSS: elementOrginalCSS,
						});
					}
				}
			}
		}
	}

	removeScrollTriggers(pageId) {
		let triggerElementsFiltered;

		triggerElementsFiltered = this.triggerElements.filter((item) => {
			return item.pageId !== pageId;
		});

		this.triggerElements = triggerElementsFiltered;
	}

	scrollParallax() {
		let i;
		let arrayCount;

		let speed;
		let round;

		let cssObject;
		let translateY;

		if (utilityService.browserSupport.parallaxCapable === false) {
			return;
		}

		if (this.scrollY !== null) {
			for (
				i = 0, arrayCount = this.parallaxElements.length;
				i < arrayCount;
				i++
			) {
				speed = this.parallaxElements[i].speed;
				round = this.parallaxElements[i].round;

				translateY = 0;

				if (this.scrollY !== null) {
					if (round !== true) {
						translateY = this.scrollY - speed * this.scrollY;
					} else {
						translateY =
							this.scrollY - Math.round(speed * this.scrollY);
					}
				}

				if (translateY === 0) {
					this.parallaxElements[i].element.css(null);
					cssObject = {};

					cssObject[utilityService.transformProperty] =
						'translate3d(0, 0, 0)';
				} else {
					translateY = '' + translateY + 'px';

					cssObject = {};
					cssObject[utilityService.transitionProperty] = 'none';
					cssObject[utilityService.transformProperty] =
						'translate3d(0, ' + translateY + ', 0)';
				}

				this.parallaxElements[i].element.css(cssObject);
			}
		}
	}

	setScrollParallax(className, parallaxObject) {
		let i;
		let j;

		let arrayCount;
		let arrayCountElement;

		let speed;
		let round;

		let pageId;
		let element;
		let elementEqual;

		let offsetY;

		let cssObject;

		const vm = this;
		const elementArray = $(className);

		if (utilityService.browserSupport.parallaxCapable === false) {
			return;
		}

		if (elementArray.length > 0) {
			for (i = 0, arrayCount = elementArray.length; i < arrayCount; i++) {
				element = $(elementArray[i]);

				if (element) {
					offsetY = element.offset().top + vm.scrollY;

					speed = parallaxObject.speed;
					round = parallaxObject.round;

					pageId = parallaxObject.pageId;

					cssObject = {};
					cssObject[utilityService.transformProperty] =
						'translate3d(0, 0, 0)';

					element.css(cssObject);

					elementEqual = false;
					arrayCountElement = this.parallaxElements.length;

					for (j = 0; j < arrayCountElement; j++) {
						if (
							element[0] === this.parallaxElements[j].element[0]
						) {
							elementEqual = true;

							this.parallaxElements[j].offsetY = offsetY;
						}
					}

					if (elementEqual === false) {
						this.parallaxElements.push({
							pageId: pageId,
							element: element,
							speed: speed,
							round: round,

							offsetY: offsetY,
						});
					}
				}
			}
		}
	}

	removeScrollParallax(pageId) {
		let parallaxElementsFiltered;

		parallaxElementsFiltered = this.parallaxElements.filter((item) => {
			return item.pageId !== pageId;
		});

		this.parallaxElements = parallaxElementsFiltered;
	}

	addScrollEventListeners() {
		const vm = this;

		vm.scrollElement = $('#AppRoot');
		vm.scrollOriginalElement = $('#AppRoot')[0];

		vm.scrollY = 0;

		vm.triggerElements = [];
		vm.parallaxElements = [];

		const debouncerCalculateResize = utilityService.addDebouncer(
			vm.calculateResize
		);
		const debouncerCalculateScroll = utilityService.addDebouncer(
			vm.calculateScroll
		);

		const debouncerCalculateTouchMove = utilityService.addDebouncer(
			vm.calculateTouchMove
		);

		window.addEventListener('load', (event) => {
			vm.scrollOriginalElement.scrollTop = 0;
		});

		eventService.on('resize', vm.guid, (event) => {
			debouncerCalculateResize.handleEvent(event);
		});

		vm.scrollElement.on('touchmove', (event) => {
			debouncerCalculateTouchMove.handleEvent(event);
		});

		vm.scrollElement.on('scroll', (event) => {
			debouncerCalculateScroll.handleEvent(event);
		});
	}
}

export default ScrollService;
