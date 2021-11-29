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

		this.updateTimeout = null;
		this.updateInterval = null;

		this.updateTimeoutTime = 5000;
		this.updateIntervalTime = 1000;

		this.loader = React.createRef();

		this.componentName = 'TokenSale';

		this.guid = utilityService.guid();

		this.getData = this.getData.bind(this);

		this.notStarted = this.notStarted.bind(this);
		this.participate = this.participate.bind(this);
		this.claimPunkTokens = this.claimPunkTokens.bind(this);
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
		// configService.countDownEnd = 1638134090000;
		// configService.countDownStart = 1638228122641;

		const vm = this;
		const pageElement = $('.' + vm.componentName + '.View');

		vm.updateView();
		vm.setPageSize();

		vm.getData();

		vm.loader.current.showLoader(false);

		if (localStorage.getItem('legalShow') !== 'shown') {
			eventService.dispatchObjectEvent('show:modal', {
				type: 'blockModal',
				header: 'Terms of use',
				animate: false,
				animateClose: true,
				blockStorage: 'legalShow',
				blockStorageValue: 'shown',
				content:
					'By using this website and investing in the PUNK token, you will be deemed to have:<br /><br />Read the Legal notice and other informational materials about the operation of this token sale<br /><br />Confirmed that you are not based in a jurisdiction where buying, trading and/or owning the PUNK token would be prohibited or restricted in any manner<br /><br />Understood that, despite our best efforts, there can still be exploit risks that exist within the app. Please do not invest more than you can afford to lose',
				buttonText: 'Accept',
			});
		}

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
			vm.setState(this.state);
			vm.forceUpdate();
		});

		eventService.on('account:change', vm.guid, () => {
			vm.loader.current.showLoader(false);
			vm.getData();
		});

		eventService.dispatchObjectEvent('set:view', this.componentName);
		transitionService.updateTransition(this.props, this.componentName);
	}

	componentDidUpdate() {
		viewService.resetScroll();
	}

	getData() {
		let time;
		let view;
		let state;

		const vm = this;

		time = new Date().getTime();

		const countDownEnd = configService.countDownEnd;
		const countDownStart = configService.countDownStart;

		state = utilityService.cloneObject(vm.state);

		vm.setTimeInterval();

		if (time < countDownStart) {
			view = 'countToSale';

			state.view = view;
			state.requestError = false;

			tokenSaleService.raised = '0';
			tokenSaleService.contribution = '0';

			vm.setState(state, () => {
				vm.loader.current.hideLoader(true);
			});

			vm.forceUpdate();
		} else {
			if (time >= countDownEnd) {
				view = 'tokenSaleCompleted';

				getContractData();
			} else {
				view = 'countToSaleEnd';

				getContractDataInterval();
			}
		}

		function getContractData() {
			appService
				.getSaleData()
				.then((response) => {
					time = new Date().getTime();
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
					state.requestError = false;

					vm.setState(state, () => {
						vm.loader.current.hideLoader(true);
					});

					vm.forceUpdate();
				})
				.catch((responseError) => {
					time = new Date().getTime();
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

					if (tokenSaleService.raised === '0') {
						state.requestError = true;
					} else {
						state.requestError = false;
					}

					vm.setState(state, () => {
						vm.loader.current.hideLoader(true);

						clearTimeout(vm.updateTimeout);
						vm.updateTimeout = setTimeout(() => {
							vm.getData();
						}, vm.updateTimeoutTime);
					});

					vm.forceUpdate();
				});
		}

		function getContractDataInterval() {
			appService
				.getSaleData()
				.then((response) => {
					time = new Date().getTime();
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
					state.requestError = false;

					vm.setState(state, () => {
						vm.loader.current.hideLoader(true);

						clearTimeout(vm.updateTimeout);
						vm.updateTimeout = setTimeout(() => {
							vm.getData();
						}, vm.updateTimeoutTime);
					});

					vm.forceUpdate();
				})
				.catch((responseError) => {
					time = new Date().getTime();
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

					if (tokenSaleService.raised === '0') {
						state.requestError = true;
					} else {
						state.requestError = false;
					}

					vm.setState(state, () => {
						vm.loader.current.hideLoader(true);

						clearTimeout(vm.updateTimeout);
						vm.updateTimeout = setTimeout(() => {
							vm.getData();
						}, vm.updateTimeoutTime);
					});

					vm.forceUpdate();
				});
		}
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

	setTimeInterval() {
		let time;
		let view;
		let state;

		let countDownEnd;
		let countDownStart;

		const vm = this;

		clearInterval(vm.updateInterval);

		vm.updateInterval = setInterval(() => {
			time = new Date().getTime();
			state = utilityService.cloneObject(vm.state);

			countDownEnd = configService.countDownEnd;
			countDownStart = configService.countDownStart;

			if (time < countDownStart) {
				view = 'countToSale';
			} else {
				if (time < countDownEnd) {
					view = 'countToSaleEnd';
				} else {
					view = 'tokenSaleCompleted';
				}
			}

			if (view !== state.view) {
				vm.getData();

				state.view = view;

				vm.setState(state, () => {});
			}
		}, vm.updateIntervalTime);
	}

	notStarted() {
		eventService.dispatchObjectEvent('show:modal', {
			type: 'alertModal',
			header: 'Not started',
			content: 'The token sale will start on December 1st at 14:00 GMT',
			buttonText: 'Ok',
		});
	}

	participate() {
		const vm = this;

		const userSignedIn = userService.userSignedIn;

		if (userSignedIn !== true) {
			eventService.dispatchObjectEvent('show:modal', {
				type: 'walletModal',
				raised: tokenSaleService.raised,
			});
		} else {
			eventService.dispatchObjectEvent('show:modal', {
				type: 'participateModal',
				participateSale: vm.participateSale,
			});
		}
	}

	claimPunkTokens() {
		const userSignedIn = userService.userSignedIn;

		if (userSignedIn !== true) {
			eventService.dispatchObjectEvent('show:modal', {
				type: 'walletModal',
				raised: tokenSaleService.raised,
			});
		} else {
			appService
				.claimPunkTokens()
				.then((response) => {
					// console.log(response);
				})
				.catch((responseError) => {
					// console.log(responseError);
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

		if (view === 'loading') {
			return null;
		}

		if (view === 'countToSale') {
			return (
				<>
					<Button
						type={'navigationButton'}
						label={'Read more'}
						title={'Read more'}
						onClick={(event) => {
							event.preventDefault();
							vm.scrollToContent();
						}}
						cssClass={'NavigationButtonAction'}
						iconImage="/static/media/images/icon-read.svg"
					/>
					<div className="HeaderButtonSpacer" />
					<Button
						type={'navigationButton'}
						label={'Contribute'}
						title={'Contribute'}
						onClick={(event) => {
							event.preventDefault();

							vm.notStarted();
						}}
						cssClass={'NavigationButtonAction'}
						iconImage="/static/media/images/icon-wallet.svg"
					/>
				</>
			);
		}

		if (view === 'countToSaleEnd') {
			return (
				<>
					<Button
						type={'navigationButton'}
						label={'Read more'}
						title={'Read more'}
						onClick={(event) => {
							event.preventDefault();
							vm.scrollToContent();
						}}
						cssClass={'NavigationButtonAction'}
						iconImage="/static/media/images/icon-read.svg"
					/>
					<div className="HeaderButtonSpacer" />
					<Button
						type={'navigationButton'}
						label={'Contribute'}
						title={'Contribute'}
						onClick={(event) => {
							event.preventDefault();

							vm.participate();
						}}
						cssClass={'NavigationButtonAction'}
						iconImage="/static/media/images/icon-wallet.svg"
					/>
				</>
			);
		}

		if (view === 'tokenSaleCompleted') {
			return (
				<Button
					type={'navigationButton'}
					label={'Claim PUNK'}
					title={'Claim PUNK'}
					onClick={(event) => {
						event.preventDefault();

						vm.claimPunkTokens();
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
		const view = vm.state.view;

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

			if (vm.state.requestError === true) {
				currentShare = 'Connection error';
			} else {
				if (BigNumber(raised).eq(0)) {
					currentShare = '0.00 PUNK';
				} else {
					currentShare =
						BigNumber(contribution)
							.div(BigNumber(raised))
							.times(50e6)
							.toFormat(2) + ' PUNK';
				}
			}

			if (view !== 'tokenSaleCompleted') {
				return (
					<div className="TokenSaleItem">
						<span className="TokenSaleTitle">My share</span>
						<span className="TokenSaleContent">{currentShare}</span>
					</div>
				);
			} else {
				return (
					<div className="TokenSaleItem">
						<span className="TokenSaleTitle">Unclaimed</span>
						<span className="TokenSaleContent">{currentShare}</span>
					</div>
				);
			}
		}
	}

	tokenSaleComponent() {
		let raised;
		let tokenPrice;
		let raisedText;

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
						<div className="TokenSaleIcon">
							<img
								alt={''}
								className={'TokenSaleIconContent'}
								src={'/static/media/images/icon-time-blue.svg'}
							/>
						</div>
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
							<span className="TokenSaleTitle">Sale status</span>
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
			if (vm.state.requestError === true) {
				raisedText = 'Connection error';
			} else {
				raised =
					BigNumber(tokenSaleService.raised).div(1e18).toFormat(2) +
					' xDai';

				tokenPrice =
					BigNumber(tokenSaleService.raised)
						.div(1e18)
						.div(50e6)
						.toFormat(6) + ' xDai';

				raisedText = raised + ' : ' + tokenPrice;
			}

			return (
				<div className="TokenSaleInfo">
					<div className="TokenSaleMain">
						<div className="TokenSaleIcon">
							<img
								alt={''}
								className={'TokenSaleIconContent'}
								src={'/static/media/images/icon-time-blue.svg'}
							/>
						</div>
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
								Raised : price
							</span>
							<span className="TokenSaleContent">
								{raisedText}
							</span>
						</div>
					</div>
					<div className="TokenSaleSubMain">
						<TokenSubComponent />
					</div>
				</div>
			);
		}

		if (view === 'tokenSaleCompleted') {
			if (vm.state.requestError === true) {
				tokenPrice = 'Connection error';
				raisedText = 'Connection error';
			} else {
				raised =
					BigNumber(tokenSaleService.raised).div(1e18).toFormat(2) +
					' xDai';

				tokenPrice =
					BigNumber(tokenSaleService.raised)
						.div(1e18)
						.div(50e6)
						.toFormat(6) + ' xDai';

				raisedText = '50M PUNK : ' + raised;
			}

			return (
				<div className="TokenSaleInfo">
					<div className="TokenSaleIcon">
						<img
							alt={''}
							className={'TokenSaleIconContent'}
							src={'/static/media/images/icon-token-blue.svg'}
						/>
					</div>
					<div className="TokenSaleMain">
						<div className="TokenSaleItem">
							<span className="TokenSaleTitle">
								Total amount raised
							</span>
							<span className="TokenSaleContent">
								{raisedText}
							</span>
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
						<TokenSubComponent />
					</div>
				</div>
			);
		}
	}

	componentWillUnmount() {
		const vm = this;

		clearTimeout(vm.updateTimeout);
		clearInterval(vm.updateInterval);

		eventService.off('resize', vm.guid);
		eventService.off('route:home', vm.guid);
		eventService.off('force:state', vm.guid);
		eventService.off('account:change', vm.guid);
		eventService.off('preloader:hide', vm.guid);
	}

	render() {
		let transitionClass;

		const vm = this;
		const view = vm.state.view;

		const ButtonComponent = vm.buttonComponent;
		const TokenSaleComponent = vm.tokenSaleComponent;

		if (this.props.animationType === 'overlay') {
			transitionClass = 'Overlay';
		}

		if (this.props.animationType === 'underlay') {
			transitionClass = 'Underlay';
		}

		if (view !== 'tokenSaleCompleted') {
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
											<span className="TextDark">
												Token
											</span>
											<span className="TextDark">
												{' '}
												sale
											</span>
										</span>
										<span className="IntroPunkSubText">
											Make sure that you have read all
											info of the token sale <br />
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
										<div
											id="PunkToken"
											className="BlockTitle">
											Information
										</div>
										<div className="ContentItemContent">
											The token sale is a so-called
											Initial Bond Curve Offering. This
											means that your share will decrease
											and the token price will increase
											when other participants contribute
											<br />
											<br />
											More info on the PUNK token and how
											an Initial Bond Curve Offering works
											can be found on the{' '}
											<a
												href="/token"
												onClick={(event) => {
													event.preventDefault();
													event.stopPropagation();

													routeService.navigateRoute(
														'/token'
													);
												}}>
												token page
											</a>
											. Please make sure that you have
											read this page before contributing
											to the token sale
											<br />
											<br />
											The token sale will start on
											December 1st at 14:00 GMT and will
											last 7 days. The token sale will end
											on December 8th at 14:00 GMT. The
											PUNK tokens can be claimed
											immediately after the token sale has
											ended
										</div>
									</div>
									<div className="ContentBlock">
										<div
											id="PunkToken"
											className="BlockTitle">
											Contribute
										</div>
										<div className="ContentItemContent">
											If you want to participate in the
											token sale, you can add your
											contribution by clicking the
											‘Contribute’ button. A dialog will
											be shown where you can enter the
											amount of xDai you want to
											contribute to the token sale
											<br />
											<br />
											After you have entered the amount
											and have clicked the ‘Add
											contribution’ button, MetaMask will
											ask you to confirm the transaction.
											Once the transaction is confirmed,
											this page will show you your share
											in PUNK tokens
											<br />
											<br />
											Your share of the token sale will
											decrease and the token price will
											increase, when other participants
											contribute to the token sale. This
											will continue until the token sale
											has ended. Your final share and the
											final token price will be
											established after the token sale has
											ended
											<br />
											<br />
											There is no limit on contributions
											and participants can contribute
											multiple times during the token
											sale. If the token page is
											unavailable, you can directly send
											your contribution to the token sale
											contract. The address of the token
											sale contract can be found in the
											footer of this page. Please make
											sure that you send xDai to this
											contract
										</div>
									</div>
									<div className="ContentBlock">
										<div
											id="PunkToken"
											className="BlockTitle">
											Claiming tokens
										</div>
										<div className="ContentItemContent">
											Participants will be able to claim
											their share of PUNK tokens
											immediately after token sale has
											ended. Participants can claim tokens
											on the token sale page
											<br />
											<br />
											When the token sale has ended, this
											page will display your number of
											unclaimed PUNK tokens. If you have
											unclaimed tokens you can claim them
											by pressing the ‘Claim PUNK’ button
											<br />
											<br />
											MetaMask will ask you to confirm the
											transaction. After the transaction
											has been confirmed, the PUNK tokens
											are added your wallet and unclaimed
											tokens will display 0.00 PUNK
											<br />
											<br />
											If you want MetaMask to display your
											PUNK tokens, you will need to add
											the token to MetaMask. You can do so
											by clicking ‘Assets’. In this tab,
											you then click on ‘Import tokens’.
											In the form you will need to add the
											contract address of the token. This
											address can be found in the footer
											of this page
											<br />
											<br />
											Once you have entered the contract
											address, the other fields will
											automatically be filled. If this is
											not the case, you have to enter
											‘PUNK’ in the ‘Token Symbol’ field
											and ’18’ in the in the ‘Token
											Decimal’ field. Click ‘Add custom
											token’. If all went well, you will
											be able to see the PUNK token in the
											assets tab
										</div>
									</div>
									<div className="ContentBlock">
										<div
											id="PunkToken"
											className="BlockTitle">
											Legal notice
										</div>
										<div className="ContentItemContent">
											Investment in a token sale entails
											risk of a partial or complete loss
											of the investment. No guarantee is
											given regarding the value of the
											tokens acquired in the offering and
											the exchange value of said tokens in
											legal currency. Tokens do not
											constitute financial instruments or
											securities tokens and confer no
											other rights than those described.
											In addition, the regulatory
											framework applicable to the offering
											and to the tokens as well as the tax
											regime applicable to the holding of
											tokens are not defined to date in
											certain jurisdictions. Please
											consult your local tax and legal
											advisor before considering
											purchasing tokens.
										</div>
									</div>
								</div>
							</div>
						</div>
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
											<span className="TextDark">
												Token
											</span>
											<span className="TextDark">
												{' '}
												sale
											</span>
										</span>
										<span className="IntroPunkSubText">
											Press 'Claim PUNK' to claim your
											tokens. After you have claimed your
											tokens <br />
											your unclaimed tokens will be zero
										</span>
										<div className="HeaderButtonContainer">
											<ButtonComponent />
										</div>
									</div>
									<div className="IntroBottomGradient" />
								</div>
								<div className="IntroContent">
									<div className="ContentBlock">
										<div
											id="PunkToken"
											className="BlockTitle">
											Information
										</div>
										<div className="ContentItemContent">
											The token sale is a so-called
											Initial Bond Curve Offering. This
											means that your share will decrease
											and the token price will increase
											when other participants contribute
											<br />
											<br />
											More info on the PUNK token and how
											an Initial Bond Curve Offering works
											can be found on the{' '}
											<a
												href="/token"
												onClick={(event) => {
													event.preventDefault();
													event.stopPropagation();

													routeService.navigateRoute(
														'/token'
													);
												}}>
												token page
											</a>
											. Please make sure that you have
											read this page before contributing
											to the token sale
											<br />
											<br />
											The token sale will start on
											December 1st at 14:00 GMT and will
											last 7 days. The token sale will end
											on December 8th at 14:00 GMT. The
											PUNK tokens can be claimed
											immediately after the token sale has
											ended
										</div>
									</div>
									<div className="ContentBlock">
										<div
											id="PunkToken"
											className="BlockTitle">
											Contribute
										</div>
										<div className="ContentItemContent">
											If you want to participate in the
											token sale, you can add your
											contribution by clicking the
											‘Contribute’ button. A dialog will
											be shown where you can enter the
											amount of xDai you want to
											contribute to the token sale
											<br />
											<br />
											After you have entered the amount
											and have clicked the ‘Add
											contribution’ button, MetaMask will
											ask you to confirm the transaction.
											Once the transaction is confirmed,
											this page will show you your share
											in PUNK tokens
											<br />
											<br />
											Your share of the token sale will
											decrease and the token price will
											increase, when other participants
											contribute to the token sale. This
											will continue until the token sale
											has ended. Your final share and the
											final token price will be
											established after the token sale has
											ended
											<br />
											<br />
											There is no limit on contributions
											and participants can contribute
											multiple times during the token
											sale. If the token page is
											unavailable, you can directly send
											your contribution to the token sale
											contract. The address of the token
											sale contract can be found in the
											footer of this page. Please make
											sure that you send xDai to this
											contract
										</div>
									</div>
									<div className="ContentBlock">
										<div
											id="PunkToken"
											className="BlockTitle">
											Claiming tokens
										</div>
										<div className="ContentItemContent">
											Participants will be able to claim
											their share of PUNK tokens
											immediately after token sale has
											ended. Participants can claim tokens
											on the token sale page
											<br />
											<br />
											When the token sale has ended, this
											page will display your number of
											unclaimed PUNK tokens. If you have
											unclaimed tokens you can claim them
											by pressing the ‘Claim PUNK’ button
											<br />
											<br />
											MetaMask will ask you to confirm the
											transaction. After the transaction
											has been confirmed, the PUNK tokens
											are added your wallet and unclaimed
											tokens will display 0.00 PUNK
											<br />
											<br />
											If you want MetaMask to display your
											PUNK tokens, you will need to add
											the token to MetaMask. You can do so
											by clicking ‘Assets’. In this tab,
											you then click on ‘Import tokens’.
											In the form you will need to add the
											contract address of the token. This
											address can be found in the footer
											of this page
											<br />
											<br />
											Once you have entered the contract
											address, the other fields will
											automatically be filled. If this is
											not the case, you have to enter
											‘PUNK’ in the ‘Token Symbol’ field
											and ’18’ in the in the ‘Token
											Decimal’ field. Click ‘Add custom
											token’. If all went well, you will
											be able to see the PUNK token in the
											assets tab
										</div>
									</div>
									<div className="ContentBlock">
										<div
											id="PunkToken"
											className="BlockTitle">
											Legal notice
										</div>
										<div className="ContentItemContent">
											Investment in a token sale entails
											risk of a partial or complete loss
											of the investment. No guarantee is
											given regarding the value of the
											tokens acquired in the offering and
											the exchange value of said tokens in
											legal currency. Tokens do not
											constitute financial instruments or
											securities tokens and confer no
											other rights than those described.
											In addition, the regulatory
											framework applicable to the offering
											and to the tokens as well as the tax
											regime applicable to the holding of
											tokens are not defined to date in
											certain jurisdictions. Please
											consult your local tax and legal
											advisor before considering
											purchasing tokens.
										</div>
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
}

export default TokenSale;
