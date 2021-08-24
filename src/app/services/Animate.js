import UtilityService from 'src/app/services/UtilityService';

let Instance;

const utilityService = new UtilityService();

class Animate {
	constructor() {
		if (!Instance) {
			Instance = this;
		}

		return Instance;
	}

	transitionAddClass(element, cssClass) {
		return this.transitionPromiseResolver('add', element, cssClass);
	}

	transitionRemoveClass(element, cssClass) {
		return this.transitionPromiseResolver('remove', element, cssClass);
	}

	transitionResolved(type, element, cssClass) {
		let transitionEndProperty = utilityService.transitionEndProperty;

		if (!transitionEndProperty) {
			return 'resolved';
		}

		if (!this.checkCssTransitionAbility(element)) {
			return 'resolved';
		}

		if (
			this.checkTransitionEventProperty(type, element, cssClass) === 'resolved'
		) {
			return 'resolved';
		}

		if (
			this.checkTransitionEventProperty(type, element, cssClass) ===
			'unresolved'
		) {
			return 'unresolved';
		}

		if (
			this.checkTransitionEventProperty(type, element, cssClass) === 'other'
		) {
			return 'other';
		}
	}

	checkCssTransitionAbility(element) {
		let delayTime;
		let durationTime;
		let transitionDelay;
		let transitionDuration;

		transitionDelay = element.css('transition-delay');
		transitionDuration = element.css('transition-duration');

		if (!transitionDelay && !transitionDuration) {
			return false;
		}

		delayTime = 0;
		durationTime = 0;

		if (transitionDelay) {
			delayTime = parseFloat(transitionDelay.replace('s', ''));
		}

		if (transitionDuration) {
			durationTime = parseFloat(transitionDuration.replace('s', ''));
		}

		return delayTime > 0 || durationTime > 0;
	}

	checkTransitionEventProperty(type, element, cssClass) {
		let transitionEndProperty = utilityService.transitionEndProperty;

		if (type === 'add') {
			if (!element.hasClass(cssClass)) {
				return 'unresolved';
			} else {
				if (
					!element[0].events ||
					!element[0].events.hasOwnProperty(transitionEndProperty)
				) {
					return 'unresolved';
				} else {
					return 'other';
				}
			}
		}

		if (type === 'remove') {
			if (element.hasClass(cssClass)) {
				return 'unresolved';
			} else {
				if (
					!element[0].events ||
					!element[0].events.hasOwnProperty(transitionEndProperty)
				) {
					return 'unresolved';
				} else {
					return 'other';
				}
			}
		}
	}

	transitionPromiseResolver(type, element, cssClass) {
		let deferred = $.deferred();
		let deferredPromise = deferred.promise();

		let transitionEndProperty = utilityService.transitionEndProperty;
		let transitionResolved = this.transitionResolved(type, element, cssClass);

		if (transitionResolved === 'other') {
			deferred.reject({
				result: 'error',
				message: 'Has other transition',
			});
			return deferredPromise;
		}

		if (transitionResolved === 'resolved') {
			element.off(transitionEndProperty);

			if (type === 'add') {
				element.addClass(cssClass);
			}

			if (type === 'remove') {
				element.removeClass(cssClass);
			}

			deferred.resolve({
				result: 'success',
			});

			return deferredPromise;
		}

		if (transitionResolved === 'unresolved') {
			element.off(transitionEndProperty);

			element.on(transitionEndProperty, transitionReady);

			if (type === 'add') {
				element.addClass(cssClass);
			}

			if (type === 'remove') {
				element.removeClass(cssClass);
			}

			function transitionReady(event) {
				if (element[0] === event.target) {
					element.off(transitionEndProperty);
					deferred.resolve({
						result: 'success',
					});
				}
			}

			return deferredPromise;
		}
	}

	animationAddClass(element, cssClass) {
		return this.animationPromiseResolver('add', element, cssClass);
	}

	animationRemoveClass(element, cssClass) {
		return this.animationPromiseResolver('remove', element, cssClass);
	}

	animationResolved(type, element, cssClass) {
		let animationEndProperty = utilityService.animationEndProperty;

		if (!animationEndProperty) {
			return 'resolved';
		}

		if (!this.checkCssAnimationAbility(element)) {
			return 'resolved';
		}

		if (
			this.checkAnimationEventProperty(type, element, cssClass) === 'resolved'
		) {
			return 'resolved';
		}

		if (
			this.checkAnimationEventProperty(type, element, cssClass) === 'unresolved'
		) {
			return 'unresolved';
		}

		if (this.checkAnimationEventProperty(type, element, cssClass) === 'other') {
			return 'other';
		}
	}

	checkCssAnimationAbility(element) {
		let delayTime;
		let durationTime;
		let animationDelay;
		let animationDuration;

		animationDelay = element.css('animation-delay');
		animationDuration = element.css('animation-duration');

		if (!animationDelay && !animationDuration) {
			return false;
		}

		delayTime = 0;
		durationTime = 0;

		if (animationDelay) {
			delayTime = parseFloat(animationDelay.replace('s', ''));
		}

		if (animationDuration) {
			durationTime = parseFloat(animationDuration.replace('s', ''));
		}

		return delayTime > 0 || durationTime > 0;
	}

	checkAnimationEventProperty(type, element, cssClass) {
		let animationEndProperty = utilityService.animationEndProperty;

		if (type === 'add') {
			if (!element.hasClass(cssClass)) {
				return 'unresolved';
			} else {
				if (
					!element[0].events ||
					!element[0].events.hasOwnProperty(animationEndProperty)
				) {
					return 'unresolved';
				} else {
					return 'other';
				}
			}
		}

		if (type === 'remove') {
			if (element.hasClass(cssClass)) {
				return 'unresolved';
			} else {
				if (
					!element[0].events ||
					!element[0].events.hasOwnProperty(animationEndProperty)
				) {
					return 'unresolved';
				} else {
					return 'other';
				}
			}
		}
	}

	animationPromiseResolver(type, element, cssClass) {
		let deferred = $.deferred();
		let deferredPromise = deferred.promise();

		let animationEndProperty = utilityService.animationEndProperty;
		let animationResolved = this.animationResolved(type, element, cssClass);

		if (animationResolved === 'other') {
			deferred.reject({
				result: 'error',
				message: 'Has other animation',
			});

			return deferredPromise;
		}

		if (animationResolved === 'resolved') {
			element.off(animationEndProperty);

			if (type === 'add') {
				element.addClass(cssClass);
			}

			if (type === 'remove') {
				element.removeClass(cssClass);
			}

			deferred.resolve({
				result: 'success',
			});

			return deferredPromise;
		}

		if (animationResolved !== 'unresolved') {
			element.off(animationEndProperty);
			element.on(animationEndProperty, animationReady);

			if (type === 'add') {
				element.addClass(cssClass);
			}

			if (type === 'remove') {
				element.removeClass(cssClass);
			}

			function animationReady(event) {
				if (element[0] === event.target) {
					element.off(animationEndProperty);
					deferred.resolve({
						result: 'success',
					});
				}
			}

			return deferredPromise;
		}
	}
}

export default Animate;
