import Animate from 'src/app/services/Animate';
import EventService from 'src/app/services/EventService';
import UtilityService from 'src/app/services/UtilityService';

const animate = new Animate();
const eventService = new EventService();
const utilityService = new UtilityService();

class Preloader {
	constructor() {
		this.spinnerElement = null;
		this.preloaderElement = null;

		this.animationPromise = null;
		this.guid = utilityService.guid();

		this.initalize();
	}

	initalize() {
		const vm = this;

		this.spinnerElement = $('#Preloader .Spinner');
		this.preloaderElement = $('#Preloader');

		eventService.on('hide:preloader', vm.guid, function (animation) {
			vm.hidePreloader(animation);
		});

		eventService.on('show:preloader', vm.guid, function (animation) {
			vm.showPreloader(animation);
		});
	}

	showPreloader(animation = true) {
		let vm = this;

		if (!animation) {
			vm.spinnerElement.addClass('Active');
			vm.preloaderElement.removeClass('Animate');
			vm.preloaderElement.removeClass('ScreenHidden');

			vm.preloaderElement.removeClass('Hide');

			eventService.dispatchObjectEvent('preloader:show');
		} else {
			vm.spinnerElement.addClass('Active');
			vm.preloaderElement.addClass('Animate');
			vm.preloaderElement.removeClass('ScreenHidden');

			vm.animationPromise = animate.transitionRemoveClass(
				vm.preloaderElement,
				'Hide'
			);

			vm.animationPromise.fail((error) => {});

			vm.animationPromise.then((response) => {
				if (response.result === 'success') {
					eventService.dispatchObjectEvent('preloader:show');
				}
			});
		}
	}

	hidePreloader(animation = true) {
		let vm = this;

		if (!animation) {
			vm.spinnerElement.removeClass('Active');
			vm.preloaderElement.removeClass('Animate');

			vm.preloaderElement.addClass('Hide');
			vm.preloaderElement.addClass('ScreenHidden');

			eventService.dispatchObjectEvent('preloader:hide');
		} else {
			vm.preloaderElement.addClass('Animate');

			vm.animationPromise = animate.transitionAddClass(
				vm.preloaderElement,
				'Hide'
			);

			vm.animationPromise.fail((error) => {});

			vm.animationPromise.then((response) => {
				if (response.result === 'success') {
					vm.spinnerElement.removeClass('Active');
					vm.preloaderElement.removeClass('Animate');
					vm.preloaderElement.addClass('ScreenHidden');

					eventService.dispatchObjectEvent('preloader:hide');
				}
			});
		}
	}
}

export default Preloader;
