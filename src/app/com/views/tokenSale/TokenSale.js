/* eslint-disable array-callback-return */
import React, { PureComponent } from 'react';
import { BigNumber } from 'bignumber.js';

import Button from 'src/app/com/button/Button';
import Loader from 'src/app/com/loader/Loader';
import Footer from 'src/app/com/footer/Footer';
import CountDown from 'src/app/com/countDown/CountDown';

import AppService from 'src/app/services/AppService';
import ViewService from 'src/app/services/ViewService';
import UserService from 'src/app/services/UserService';
import EventService from 'src/app/services/EventService';
import RouteService from 'src/app/services/RouteService';
import ConfigService from 'src/app/services/ConfigService';
import UtilityService from 'src/app/services/UtilityService';
import TokenSaleService from 'src/app/services/TokenSaleService';
import TransitionService from 'src/app/services/TransitionService';

const appService = new AppService();
const viewService = new ViewService();
const userService = new UserService();
const eventService = new EventService();
const routeService = new RouteService();
const configService = new ConfigService();
const utilityService = new UtilityService();
const tokenSaleService = new TokenSaleService();
const transitionService = new TransitionService();

/* States
 * error
 * loading
 * countToSale
 * countToSaleEnd
 * tokenSaleCompleted
 */

class TokenSale extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			view: 'loading',
			requestError: false,
		};

		this.loader = React.createRef();

		this.componentName = 'TokenSale';

		this.guid = utilityService.guid();

		this.getData = this.getData.bind(this);

		this.participate = this.participate.bind(this);
		this.participateSale = this.participateSale.bind(this);

		this.buttonComponent = this.buttonComponent.bind(this);
		this.tokenSubComponent = this.tokenSubComponent.bind(this);
		this.tokenSaleComponent = this.tokenSaleComponent.bind(this);
	}

	updateView() {
		viewService.setViewSpacing();
		viewService.updateScrollWidth();
	}

	scrollToContent() {
		let domElement;

		domElement = $('#PunkToken');
		routeService.navigateScrollPosition(domElement);
	}

	componentDidMount() {
		// configService.countDownEnd = 1638018664000;
		configService.countDownStart = 1638017679000;

		const vm = this;
		const pageElement = $('.' + vm.componentName + '.View');

		vm.updateView();
		vm.setPageSize();

		vm.getData();
		vm.loader.current.showLoader(false);

		eventService.on('resize', vm.guid, () => {
			setTimeout(() => {
				vm.setPageSize();
			}, 10);
		});

		eventService.on('route:home', vm.guid, () => {
			pageElement.removeClass('Load');
		});

		eventService.on('preloader:hide', vm.guid, () => {
			pageElement.removeClass('Load');
		});

		eventService.on('force:state', vm.guid, () => {
			this.setState(this.state);
			this.forceUpdate();
		});

		eventService.dispatchObjectEvent('set:view', this.componentName);
		transitionService.updateTransition(this.props, this.componentName);
	}

	componentDidUpdate() {
		viewService.resetScroll();
	}

	getData() {
		let view;
		let state;

		const vm = this;

		const time = new Date().getTime();

		const countDownEnd = configService.countDownEnd;
		const countDownStart = configService.countDownStart;

		state = utilityService.cloneObject(vm.state);

		appService
			.getSaleData()
			.then((response) => {
				console.log('DONE');

				if (time < countDownStart) {
					view = 'countToSale';
				} else {
					if (time < countDownEnd) {
						view = 'countToSaleEnd';
					} else {
						view = 'tokenSaleCompleted';
					}
				}

				state.view = view;
				state.requestError = true;

				vm.setState(state, () => {
					vm.loader.current.hideLoader(true);
				});
			})
			.catch((responseError) => {
				view = 'error';
				console.log('ERRROR');

				if (time < countDownStart) {
					view = 'countToSale';
				} else {
					if (time < countDownEnd) {
						view = 'countToSaleEnd';
					} else {
						view = 'tokenSaleCompleted';
					}
				}

				state.view = view;

				vm.setState(state, () => {
					vm.loader.current.hideLoader(true);
				});
			});
	}

	setPageSize() {
		let innerHeight;
		const windowInnerHeight = window.innerHeight;

		const introStartElement = $('.ViewBox .Intro .IntroStart');

		if (utilityService.browserSupport.mobileDevice === true) {
			innerHeight = windowInnerHeight;

			introStartElement[0].style.height = innerHeight + 'px';
		}
	}

	participate() {
		const vm = this;

		const userSignedIn = userService.userSignedIn;

		if (userSignedIn !== true) {
			eventService.dispatchObjectEvent('show:modal', {
				type: 'walletModal',
			});
		} else {
			eventService.dispatchObjectEvent('show:modal', {
				type: 'participateModal',
				participateSale: vm.participateSale,
			});
		}
	}

	participateSale(amount) {
		const vm = this;

		appService
			.participateSale(amount)
			.then((response) => {
				// console.log(response);
			})
			.catch((responseError) => {
				// console.log(responseError);
			});
	}

	buttonComponent() {
		const vm = this;

		const view = vm.state.view;
		const userSignedIn = userService.userSignedIn;

		if (view === 'loading') {
			return null;
		}

		if (view === 'countToSale') {
			return (
				<Button
					type={'navigationButton'}
					label={'Contribute to token sale'}
					title={'Contribute to token sale'}
					onClick={(event) => {
						event.preventDefault();

						// show message
					}}
					cssClass={'NavigationButtonAction'}
					iconImage="/static/media/images/icon-wallet.svg"
				/>
			);
		}

		if (view === 'countToSaleEnd') {
			return (
				<Button
					type={'navigationButton'}
					label={'Contribute to token sale'}
					title={'Contribute to token sale'}
					onClick={(event) => {
						event.preventDefault();

						vm.participate();
					}}
					cssClass={'NavigationButtonAction'}
					iconImage="/static/media/images/icon-wallet.svg"
				/>
			);
		}

		if (view === 'tokenSaleCompleted') {
			return (
				<Button
					type={'navigationButton'}
					label={'Claim my tokens'}
					title={'Claim my tokens'}
					onClick={(event) => {
						event.preventDefault();

						// claim tokens directly
					}}
					cssClass={'NavigationButtonAction'}
					iconImage="/static/media/images/icon-wallet.svg"
				/>
			);
		}
	}

	tokenSubComponent() {
		let raised;
		let contribution;
		let currentShare;

		const vm = this;

		const userSignedIn = userService.userSignedIn;

		if (userSignedIn !== true) {
			return (
				<div className="TokenSaleItem">
					<span className="TokenSaleTitle">Total supply</span>
					<span className="TokenSaleContent">50 Million PUNK</span>
				</div>
			);
		} else {
			raised = tokenSaleService.raised;
			contribution = tokenSaleService.contribution;

			console.log(raised);
			console.log(contribution);

			currentShare = BigNumber(contribution)
				.div(BigNumber(raised))
				.times(50e6)
				.toFormat(0) + ' PUNK';

			return (
				<div className="TokenSaleItem">
					<span className="TokenSaleTitle">My share</span>
					<span className="TokenSaleContent">{currentShare}</span>
				</div>
			);
		}
	}

	tokenSaleComponent() {
		let raised;
		let tokenPrice;

		const vm = this;

		const view = vm.state.view;
		const TokenSubComponent = vm.tokenSubComponent;

		if (view === 'loading') {
			return null;
		}

		if (view === 'countToSale') {
			return (
				<div className="TokenSaleInfo">
					<div className="TokenSaleMain">
						<div className="TokenSaleItem">
							<span className="TokenSaleTitle">
								Token sale starts in
							</span>
							<span className="TokenSaleContent">
								<CountDown
									endDate={configService.countDownStart}
								/>
							</span>
						</div>
						<div className="TokenSaleSpacer" />
						<div className="TokenSaleItem">
							<span className="TokenSaleTitle">
								Amount raised
							</span>
							<span className="TokenSaleContent">
								Sale not started
							</span>
						</div>
					</div>
					<div className="TokenSaleSubMain">
						<div className="TokenSaleItem">
							<span className="TokenSaleTitle">Total supply</span>
							<span className="TokenSaleContent">
								50 Million PUNK
							</span>
						</div>
					</div>
				</div>
			);
		}

		if (view === 'countToSaleEnd') {
			// get raised and format;
			raised =
				BigNumber(tokenSaleService.raised).div(1e18).toFormat(2) +
				' xDai';

			return (
				<div className="TokenSaleInfo">
					<div className="TokenSaleMain">
						<div className="TokenSaleItem">
							<span className="TokenSaleTitle">
								Token sale ends in
							</span>
							<span className="TokenSaleContent">
								<CountDown
									endDate={configService.countDownEnd}
								/>
							</span>
						</div>
						<div className="TokenSaleSpacer" />
						<div className="TokenSaleItem">
							<span className="TokenSaleTitle">
								Amount raised
							</span>
							<span className="TokenSaleContent">{raised}</span>
						</div>
					</div>
					<div className="TokenSaleSubMain">
						<TokenSubComponent />
					</div>
				</div>
			);
		}

		if (view === 'tokenSaleCompleted') {
			raised =
				BigNumber(tokenSaleService.raised).div(1e18).toFormat(2) +
				' xDai';

			tokenPrice =
				BigNumber(tokenSaleService.raised)
					.div(1e18)
					.div(50e6)
					.toFormat(6) + ' xDai';

			return (
				<div className="TokenSaleInfo">
					<div className="TokenSaleMain">
						<div className="TokenSaleItem">
							<span className="TokenSaleTitle">
								Total amount raised
							</span>
							<span className="TokenSaleContent">{raised}</span>
						</div>
						<div className="TokenSaleSpacer" />
						<div className="TokenSaleItem">
							<span className="TokenSaleTitle">Token price</span>
							<span className="TokenSaleContent">
								{tokenPrice}
							</span>
						</div>
					</div>
					<div className="TokenSaleSubMain">
						<div className="TokenSaleItem">
							<span className="TokenSaleTitle">Total supply</span>
							<span className="TokenSaleContent">
								50 Million PUNK
							</span>
						</div>
					</div>
				</div>
			);
		}
	}

	componentWillUnmount() {
		const vm = this;

		eventService.off('resize', vm.guid);
		eventService.off('route:home', vm.guid);
		eventService.off('force:state', vm.guid);
		eventService.off('preloader:hide', vm.guid);
	}

	render() {
		let transitionClass;

		const vm = this;

		const ButtonComponent = vm.buttonComponent;
		const TokenSaleComponent = vm.tokenSaleComponent;

		if (this.props.animationType === 'overlay') {
			transitionClass = 'Overlay';
		}

		if (this.props.animationType === 'underlay') {
			transitionClass = 'Underlay';
		}

		return (
			<>
				<div
					className={
						this.componentName +
						' View ' +
						transitionClass +
						' Load'
					}>
					<div className="ViewBox">
						<div className="Intro">
							<div
								className="IntroStart"
								style={{
									backgroundImage:
										'url("/static/media/images/token-sale-background.jpg")',
								}}>
								<div className="IntroTopGradient" />
								<TokenSaleComponent />
								<div className="IntroText">
									<span className="IntroPunkText">
										<span className="TextDark">Token</span>
										<span className="TextDark"> sale</span>
									</span>
									<span className="IntroPunkSubText">
										Make sure that you have read all info of
										the token sale <br />
										before contributing
									</span>
									<div className="HeaderButtonContainer">
										<ButtonComponent />
									</div>
								</div>
								<div className="IntroBottomGradient" />
							</div>
							<div className="IntroContent">
								<div className="ContentBlock">
									<div id="PunkToken" className="BlockTitle">
										PUNK token
									</div>
									<div className="ContentItemContent"></div>
								</div>
							</div>
						</div>
					</div>
					<Footer />
				</div>
				<Loader ref={vm.loader} />
			</>
		);
	}
}

export default TokenSale;
