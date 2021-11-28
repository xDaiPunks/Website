import React, { PureComponent } from 'react';

import Animate from 'src/app/services/Animate';
import EventService from 'src/app/services/EventService';
import UtilityService from 'src/app/services/UtilityService';

const animate = new Animate();
const eventService = new EventService();
const utilityService = new UtilityService();

class Loader extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
		};

		this.loader = React.createRef();

		this.spinnerElement = null;
		this.preloaderElement = null;

		this.animationPromise = null;

		this.guid = utilityService.guid();

		this.initalize = this.initalize.bind(this);
		this.showLoader = this.showLoader.bind(this);
		this.hideLoader = this.hideLoader.bind(this);
	}

	initalize() {
		const vm = this;

		vm.spinnerElement = $('#Loader .Spinner');
		vm.preloaderElement = $('#Loader');
	}

	showLoader(animation = true) {
		const vm = this;

		vm.setState({ loading: true }, () => {
			vm.initalize();
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
		});
	}

	hideLoader(animation = true) {
		const vm = this;

		vm.initalize();
		if (!animation) {
			vm.setState({ loading: false });
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

			vm.animationPromise.fail((error) => {
				console.log('FAIL!!!!!');
				vm.setState({ loading: false });
			});

			vm.animationPromise.then((response) => {
				if (response.result === 'success') {
					vm.setState({ loading: false });
					vm.spinnerElement.removeClass('Active');
					vm.preloaderElement.removeClass('Animate');
					vm.preloaderElement.addClass('ScreenHidden');

					eventService.dispatchObjectEvent('preloader:hide');
				}
			});
		}
	}

	render() {
		let display;
		let activeSpinner;

		const vm = this;

		if (vm.state.loading !== true) {
			display = 'none';
			activeSpinner = 'Spinner';
		} else {
			display = 'block';
			activeSpinner = 'Spinner Active';
		}
		return (
			<div ref={vm.loader} id="Loader" style={{ display: display }}>
				<div className="Content">
					<div className={activeSpinner}>
						<div className="SpinnerWrapper">
							<div className="SpinnerContainer">
								<div className="CircleClipper Left">
									<div className="Circle"></div>
								</div>
								<div className="GapPatch">
									<div className="Circle"></div>
								</div>
								<div className="CircleClipper Right">
									<div className="Circle"></div>
								</div>
							</div>
							<div className="SpinnerBackground"></div>
						</div>
					</div>
				</div>
				<div className="Background"></div>
			</div>
		);
	}
}

export default Loader;
