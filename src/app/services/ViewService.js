import { scrollTo } from 'scroll-polyfill';

import EventService from 'src/app/services/EventService';
import UtilityService from 'src/app/services/UtilityService';

let Instance;

const eventService = new EventService();
const utilityService = new UtilityService();

class ViewService {
	constructor() {
		if (!Instance) {
			Instance = this;

			Instance.viewSpacing = 0;

			Instance.windowInnerWidth = null;
			Instance.windowInnerHeight = null;

			Instance.addResize = Instance.addResize.bind(this);
			Instance.setViewSpacing = Instance.setViewSpacing.bind(this);
			Instance.updateScrollWidth = Instance.updateScrollWidth.bind(this);

			Instance.addResize();
		}

		return Instance;
	}

	addResize() {
		let windowInnerWidth;
		let windowInnerHeight;

		const vm = this;

		vm.updateScrollWidth();

		windowInnerWidth = window.innerWidth;
		windowInnerHeight = window.innerHeight;

		vm.windowInnerWidth = windowInnerWidth;
		vm.windowInnerHeight = windowInnerHeight;

		const updateViewPort = (event) => {
			vm.updateScrollWidth();

			windowInnerWidth = window.innerWidth;
			windowInnerHeight = window.innerHeight;

			if (utilityService.browserSupport.mobileDevice !== true) {
				eventService.dispatchObjectEvent('resize', {
					windowInnerWidth: windowInnerWidth,
					windowInnerHeight: windowInnerHeight,
				});
			} else {
				if (windowInnerWidth !== vm.windowInnerWidth) {
					eventService.dispatchObjectEvent('resize', {
						windowInnerWidth: windowInnerWidth,
						windowInnerHeight: windowInnerHeight,
					});
				}
			}
		};

		window.addEventListener('resize', updateViewPort, false);
	}

	resetScroll() {
		scrollTo(window, {
			top: 0,
			left: 0,
			behavior: 'auto',
		});
	}

	setViewSpacing() {
		let bodyElement;
		let viewSpacing;
		let viewHeightElement;
		let percentageHeightElement;

		bodyElement = document.body;

		viewHeightElement = document.createElement('div');
		viewHeightElement.id = 'view-height';
		viewHeightElement.style.cssText =
			'position:absolute;top:0px;height:100vh';

		percentageHeightElement = document.createElement('div');
		percentageHeightElement.id = 'percentage-height';
		percentageHeightElement.style.cssText =
			'position:absolute;top:0px;height:100%';

		bodyElement.prepend(viewHeightElement);
		bodyElement.prepend(percentageHeightElement);

		viewSpacing =
			$(viewHeightElement).height() - $(percentageHeightElement).height();

		viewHeightElement.remove();
		percentageHeightElement.remove();

		if (this.viewSpacing > 0) {
			return this.viewSpacing;
		} else {
			this.viewSpacing = viewSpacing;

			return this.viewSpacing;
		}
	}

	updateScrollWidth() {
		let scrollWidth;

		let modalElement;
		let headerElement;
		let navigationElement;
		let backgroundStartElement;
		let backgroundEffectiveElement;
		let backgroundParaNegociosElement;

		scrollWidth = $('#AppRoot')[0].scrollWidth;

		modalElement = $('.App .Modal');
		headerElement = $('.App .Header');
		navigationElement = $('.App .Navigation');
		backgroundStartElement = $('.ViewBox .Intro .BackgroundStart');
		backgroundEffectiveElement = $('.ViewBox .Intro .BackgroundEffective');
		backgroundParaNegociosElement = $(
			'.ViewBox .Intro .BackgroundParaNegocios'
		);

		if (modalElement.length > 0) {
			if (modalElement.width() !== scrollWidth) {
				modalElement.css('width', scrollWidth + 'px');
			}
		}

		if (headerElement.length > 0) {
			if (headerElement.width() !== scrollWidth) {
				headerElement.css('width', scrollWidth + 'px');
			}
		}

		if (navigationElement.length > 0) {
			if (navigationElement.width() !== scrollWidth) {
				navigationElement.css('width', scrollWidth + 'px');
			}
		}

		if (backgroundStartElement.length > 0) {
			if (backgroundStartElement.width() !== scrollWidth) {
				backgroundStartElement.css('width', scrollWidth + 'px');
			}
		}

		if (backgroundEffectiveElement.length > 0) {
			if (backgroundEffectiveElement.width() !== scrollWidth) {
				backgroundEffectiveElement.css('width', scrollWidth + 'px');
			}
		}

		if (backgroundParaNegociosElement.length > 0) {
			if (backgroundParaNegociosElement.width() !== scrollWidth) {
				backgroundParaNegociosElement.css('width', scrollWidth + 'px');
			}
		}
	}
}

export default ViewService;
