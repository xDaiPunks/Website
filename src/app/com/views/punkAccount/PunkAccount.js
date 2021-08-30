import React, { PureComponent } from 'react';

import Header from 'src/app/com/header/Header';
import Footer from 'src/app/com/footer/Footer';
import Loader from 'src/app/com/loader/Loader';

import AppService from 'src/app/services/AppService';
import ViewService from 'src/app/services/ViewService';
import UserService from 'src/app/services/UserService';
import PunkService from 'src/app/services/PunkService';
import EventService from 'src/app/services/EventService';
import ScrollService from 'src/app/services/ScrollService';
import RouteService from 'src/app/services/RouteService';
import UtilityService from 'src/app/services/UtilityService';
import TransitionService from 'src/app/services/TransitionService';
import TranslationService from 'src/app/services/TranslationService';

const appService = new AppService();
const viewService = new ViewService();
const userService = new UserService();
const punkService = new PunkService();
const eventService = new EventService();
const routeService = new RouteService();
const utilityService = new UtilityService();
const transitionService = new TransitionService();
const translationService = new TranslationService();

class PunkAccount extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
		};

		this.loader = React.createRef();

		this.state = {};
		this.componentName = 'PunkAccount';

		this.guid = utilityService.guid();

		this.getData = this.getData.bind(this);
	}

	updateView() {
		viewService.setViewSpacing();
		viewService.updateScrollWidth();
	}

	componentDidMount() {
		const vm = this;
		const pageElement = $('.' + vm.componentName + '.View');

		eventService.on('preloader:hide', vm.guid, () => {
			pageElement.removeClass('Load');
		});

		eventService.on('force:state', vm.guid, () => {
			this.setState(this.state);
			this.forceUpdate();
		});

		eventService.on('change:language', vm.guid, () => {
			this.setState(this.state);
			this.forceUpdate();
		});

		vm.updateView();

		eventService.dispatchObjectEvent('set:view', this.componentName);
		transitionService.updateTransition(this.props, this.componentName);

		vm.getData();
		vm.loader.current.showLoader(false);
	}

	getData() {
		const vm = this;

		if (userService.userSignedIn !== true) {
			routeService.navigateRoute('/');
		} else {
			punkService.setPunkDetails();
			appService
				.pendingWithdrawals(userService.address)
				.then((response) => {
					console.log(response);
					vm.loader.current.hideLoader(true);
				})
				.catch((responseError) => {
					console.log(responseError);
				});
		}
	}

	componentWillUnmount() {
		const vm = this;
		eventService.off('resize', vm.guid);
		eventService.off('force:state', vm.guid);
		eventService.off('preloader:hide', vm.guid);
		eventService.off('change:language', vm.guid);
	}

	render() {
		let transitionClass;

		const vm = this;

		if (this.props.animationType === 'overlay') {
			transitionClass = 'Overlay';
		}

		if (this.props.animationType === 'underlay') {
			transitionClass = 'Underlay';
		}

		if (vm.state.loading === true) {
			return (
				<>
					<div
						className={
							this.componentName +
							' View ' +
							transitionClass +
							' Load'
						}>
						<div className="ViewBox">Loading</div>
						<Footer />
					</div>
					<Loader ref={vm.loader} />
				</>
			);
		} else {
			return (
				<>
					<div
						className={
							this.componentName +
							' View ' +
							transitionClass +
							' Load'
						}>
						<div className="ViewBox">Done</div>
						<Footer />
					</div>
					<Loader ref={vm.loader} />
				</>
			);
		}
	}
}

export default PunkAccount;
