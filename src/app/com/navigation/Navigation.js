import React, { PureComponent } from 'react';

import Button from 'src/app/com/button/Button';

import Animate from 'src/app/services/Animate';

import UserService from 'src/app/services/UserService';
import Web3Service from 'src/app/services/Web3Service';
import EventService from 'src/app/services/EventService';
import RouteService from 'src/app/services/RouteService';
import ScrollService from 'src/app/services/ScrollService';
import UtilityService from 'src/app/services/UtilityService';

const animate = new Animate();

const userService = new UserService();
const web3Service = new Web3Service();
const eventService = new EventService();
const routeService = new RouteService();
const scrollService = new ScrollService();
const utilityService = new UtilityService();

class Navigation extends PureComponent {
	constructor(props) {
		super(props);

		this.animatePromise = null;

		this.hamburgerElement = null;
		this.navigationElement = null;

		this.mobileMenuVisible = null;

		this.state = {
			currentView: null,
		};

		this.componentName = 'Navigation';

		this.guid = utilityService.guid();

		this.xDaiOnRamp = this.xDaiOnRamp.bind(this);
		this.connectWallet = this.connectWallet.bind(this);
		this.toggleMobileMenu = this.toggleMobileMenu.bind(this);

		this.actionButtonComponent = this.actionButtonComponent.bind(this);

		eventService.on('force:state', this.guid, () => {
			console.log('force state navigation', userService.address);
			this.setState(this.state);
			this.forceUpdate();
		});

		eventService.on('change:language', this.guid, () => {
			this.setState(this.state);
			this.forceUpdate();
		});

		eventService.on('set:view', this.guid, (view) => {
			let currentView;

			currentView = utilityService.lowerCaseFirst(view);

			console.log('current view', currentView);

			this.setState({
				currentView: currentView,
			});
		});
	}

	componentDidMount() {
		this.hamburgerElement = $('.Hamburger');
		this.navigationElement = $('.Navigation');

		scrollService.setScrollTriggers('.Navigation .NavigationBackground', {
			x: 0,
			y: [5],
			css: {
				opacity: 1,
			},
			pageId: 'navigation',
		});
	}

	xDaiOnRamp() {
		const vm = this;
		const address = userService.address;

		const url = 'https://buy.ramp.network/?defaultAsset=xDAI';

		vm.hideMobileMenu();

		if (!address || web3Service.isAddress(address) === false) {
			window.open(url);
		} else {
			window.open(url + '&userAddress=' + address);
		}
	}

	connectWallet() {
		const vm = this;

		vm.hideMobileMenu();

		eventService.dispatchObjectEvent('show:modal', {
			type: 'walletModal',
		});
	}

	toggleMobileMenu(event) {
		const vm = this;

		if (!vm.mobileMenuVisible) {
			vm.showMobileMenu();
		} else {
			vm.hideMobileMenu();
		}
	}

	showMobileMenu() {
		const vm = this;

		vm.mobileMenuVisible = true;

		vm.hamburgerElement = $('.Hamburger');

		if (vm.hamburgerElement.length > 0) {
			vm.hamburgerElement.addClass('Active');
		}

		if (vm.navigationElement.length > 0) {
			vm.animatePromise = animate.transitionAddClass(
				vm.navigationElement,
				'Active'
			);

			vm.animatePromise.fail((error) => {
				eventService.dispatchObjectEvent('show:nav');
			});

			vm.animatePromise.then((response) => {
				if (response.result === 'success') {
					eventService.dispatchObjectEvent('show:nav');
				}
			});
		}
	}

	hideMobileMenu() {
		const vm = this;

		vm.mobileMenuVisible = false;
		vm.mobileMenuEnabled = false;

		vm.hamburgerElement = $('.Hamburger');

		if (vm.hamburgerElement.length > 0) {
			vm.hamburgerElement.removeClass('Active');
		}

		if (vm.navigationElement.length > 0) {
			vm.animatePromise = animate.transitionRemoveClass(
				vm.navigationElement,
				'Active'
			);

			vm.animatePromise.fail((error) => {
				eventService.dispatchObjectEvent('hide:nav');
			});

			vm.animatePromise.then((response) => {
				if (response.result === 'success') {
					eventService.dispatchObjectEvent('hide:nav');
				}
			});
		}
	}

	actionButtonComponent() {
		const vm = this;
		const address = userService.address;
		const userSignedIn = userService.userSignedIn;

		if (userSignedIn !== true || web3Service.isAddress(address) !== true) {
			return (
				<>
					<Button
						type={'navigationButton'}
						label={'Connect wallet'}
						title={'Connect wallet'}
						onClick={(event) => {
							event.preventDefault();
							vm.hideMobileMenu();
							vm.connectWallet(event);
						}}
						cssClass={'NavigationButton MobileMenu'}
						iconImage="/static/media/images/icon-wallet.svg"
					/>

					<Button
						type={'navigationButton'}
						label={'Connect wallet'}
						title={'Connect wallet'}
						onClick={(event) => {
							event.preventDefault();
							vm.hideMobileMenu();
							vm.connectWallet(event);
						}}
						cssClass={'NavigationButtonAction MobileMenu'}
						iconImage="/static/media/images/icon-wallet-white.svg"
					/>
				</>
			);
		} else {
			return (
				<>
					<Button
						type={'navigationButton'}
						label={'My account'}
						title={'My account'}
						onClick={(event) => {
							event.preventDefault();
							vm.hideMobileMenu();
							routeService.navigateRoute('/my-account');
						}}
						cssClass={'NavigationButton MobileMenu'}
						iconImage="/static/media/images/icon-wallet.svg"
					/>

					<Button
						type={'navigationButton'}
						label={'My account'}
						title={'My account'}
						onClick={(event) => {
							event.preventDefault();
							vm.hideMobileMenu();
							routeService.navigateRoute('/my-account');
						}}
						cssClass={'NavigationButtonAction MobileMenu'}
						iconImage="/static/media/images/icon-wallet-white.svg"
					/>
				</>
			);
		}
	}

	componentWillUnmount() {
		const vm = this;

		eventService.off('set:view', vm.guid);
		eventService.off('force:state', vm.guid);
		eventService.off('change:language', vm.guid);
		scrollService.removeScrollTriggers('navigation');
	}

	render() {
		const vm = this;
		const currentView = vm.state.currentView;

		const ActionButtonComponent = vm.actionButtonComponent;

		console.log('CurrentView Render', currentView);

		return (
			<header className="Navigation">
				<div className="Content">
					<button
						className="ButtonLogo"
						onClick={(event) => {
							event.preventDefault();
							vm.hideMobileMenu();
							routeService.navigateRoute('/');
						}}>
						<img
							alt={'Home'}
							title={'Home'}
							className={'ButtonLogoImage'}
							src={'/static/media/images/logo.svg'}
						/>
					</button>

					<nav className="NavigationMain">
						<button
							className="HamburgerButton"
							title={'Toggle menu'}
							onClick={this.toggleMobileMenu}>
							<div className="Spacer"></div>
							<div className="Hamburger">
								<div className="HamburgerLine"></div>
							</div>
						</button>

						<div className="NavigationContent">
							<div className="MobileHeader">
								<div className="LogoNavigation">
									<button
										className="ButtonLogoNavigation"
										onClick={(event) => {
											event.preventDefault();
											vm.hideMobileMenu();
											routeService.navigateRoute('/');
										}}>
										<img
											alt={'Home'}
											className={'LogoNavigationImage'}
											src={
												'/static/media/images/logo.svg'
											}
										/>
									</button>
								</div>
							</div>
							<ul>
								<li>
									<Button
										type={'navigationButton'}
										label={'Home'}
										title={'Home'}
										onClick={(event) => {
											event.preventDefault();
											vm.hideMobileMenu();
											routeService.navigateRoute('/');
										}}
										cssClass={
											currentView === 'home'
												? 'NavigationButton Active'
												: 'NavigationButton'
										}
										iconImage="/static/media/images/icon-home.svg"
									/>
								</li>

								<li>
									<Button
										type={'navigationButton'}
										label={'Marketplace'}
										title={'Marketplace'}
										onClick={(event) => {
											event.preventDefault();
											vm.hideMobileMenu();
											routeService.navigateRoute(
												'/marketplace'
											);
										}}
										cssClass={
											currentView === 'marketPlace'
												? 'NavigationButton Active'
												: 'NavigationButton'
										}
										iconImage="/static/media/images/icon-cart.svg"
									/>
								</li>

								<li>
									<Button
										type={'navigationButton'}
										label={'Get xDai'}
										title={'Marketplace'}
										onClick={(event) => {
											event.preventDefault();
											vm.hideMobileMenu();
											vm.xDaiOnRamp();
										}}
										cssClass={'NavigationButton'}
										iconImage="/static/media/images/icon-card.svg"
									/>
								</li>

								<li className="Action">
									<ActionButtonComponent />
								</li>
							</ul>
							<div className="NavigationContentBackground"></div>
						</div>
					</nav>
				</div>
				<div
					className="NavigationBackground"
					style={{
						opacity: 0,
					}}></div>
			</header>
		);
	}
}

export default Navigation;
