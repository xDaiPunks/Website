import React, { PureComponent } from 'react';

import Footer from 'src/app/com/footer/Footer';
import Button from 'src/app/com/button/Button';
import CountDown from 'src/app/com/countDown/CountDown';

import AppService from 'src/app/services/AppService';
import ViewService from 'src/app/services/ViewService';
import PunkService from 'src/app/services/PunkService';
import EventService from 'src/app/services/EventService';
import RouteService from 'src/app/services/RouteService';
import UtilityService from 'src/app/services/UtilityService';
import TransitionService from 'src/app/services/TransitionService';

const appService = new AppService();
const viewService = new ViewService();
const punkService = new PunkService();
const eventService = new EventService();
const routeService = new RouteService();
const utilityService = new UtilityService();
const transitionService = new TransitionService();

class XDaiOnRamp extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};

		this.componentName = 'XDaiOnRamp';

		this.guid = utilityService.guid();

		this.getPunkAction = this.getPunkAction.bind(this);

		this.subContentItem = this.subContentItem.bind(this);
		this.buttonFooterItem = this.buttonFooterItem.bind(this);
	}

	updateView() {
		viewService.setViewSpacing();
		viewService.updateScrollWidth();
	}

	componentDidMount() {
		const vm = this;
		const pageElement = $('.' + vm.componentName + '.View');

		vm.updateView();
		vm.setPageSize();

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

		eventService.on('change:language', vm.guid, () => {
			this.setState(this.state);
			this.forceUpdate();
		});

		eventService.on('change:punkData', vm.guid, (eventData) => {
			if (eventData.type === 'mint' || eventData.type === 'publicSale') {
				this.setState(this.state);
				this.forceUpdate();
			}
		});

		eventService.dispatchObjectEvent('set:view', this.componentName);
		transitionService.updateTransition(this.props, this.componentName);
	}

	componentDidUpdate() {
		viewService.resetScroll();
	}

	setPageSize() {
		let innerHeight;
		const windowInnerHeight = window.innerHeight;

		const punkElement = $('.ViewBox');

		if (utilityService.browserSupport.mobileDevice === true) {
			innerHeight = windowInnerHeight;

			punkElement[0].style.minHeight = innerHeight + 'px';
		}
	}

	mintPunks(amount) {
		appService
			.mintPunks(amount)
			.then((response) => {
				// console.log(response);
				if (response.status !== true) {
					// show alert
				} else {
					routeService.navigateRoute('my-account');
				}
			})
			.catch((responseError) => {
				// console.log(responseError);
			});
	}

	getPunkAction() {
		const vm = this;

		// console.log(punkService.publicSale);
		// console.log(userService);

		eventService.dispatchObjectEvent('show:modal', {
			type: 'mintModal',
			mintPunks: vm.mintPunks,
		});
	}

	subContentItem() {
		// const vm = this;

		const publicSale = punkService.publicSale;
		const mintsCount = punkService.mintsCount;

		// console.log('minstCount', mintsCount);

		// console.log('XDaiOnRamp publicSale', publicSale);
		// console.log('XDaiOnRamp mintscount', mintsCount);

		if (publicSale !== true) {
			return (
				<div className="CountDownContainer">
					<span className="MintText">Minting starts in</span>
					<CountDown />
				</div>
			);
		} else {
			return (
				<div className="MintAmountContainer">
					<span className="MintText">Number of minted punks</span>
					<div className="MintedItems">
						<span className="MintedItemsText">
							{mintsCount} / 1000
						</span>
					</div>
				</div>
			);
		}
	}

	buttonFooterItem() {
		const vm = this;

		const publicSale = punkService.publicSale;
		const mintsCount = punkService.mintsCount;

		if (publicSale !== true) {
			return (
				<Button
					type={'actionButton'}
					label={'Follow us on Twitter'}
					title={'Follow us on Twitter'}
					onClick={(event) => {
						event.preventDefault();
						vm.getPunkAction();
					}}
					cssClass={'ActionButton'}
				/>
			);
		} else {
			if (mintsCount < 10000) {
				return (
					<Button
						type={'actionButton'}
						label={'Get a punk for 12 xDai'}
						title={'Get a punk for 12 xDai'}
						onClick={(event) => {
							event.preventDefault();
							vm.getPunkAction();
						}}
						cssClass={'ActionButton'}
					/>
				);
			} else {
				return (
					<Button
						type={'actionButton'}
						label={'View the marketplace'}
						title={'View the marketplace'}
						onClick={(event) => {
							event.preventDefault();
							vm.getPunkAction();
						}}
						cssClass={'ActionButton'}
					/>
				);
			}
		}
	}

	componentWillUnmount() {
		const vm = this;

		eventService.off('resize', vm.guid);
		eventService.off('route:home', vm.guid);
		eventService.off('force:state', vm.guid);
		eventService.off('preloader:hide', vm.guid);
		eventService.off('change:language', vm.guid);
		eventService.off('change:punkData', vm.guid);
	}

	render() {
		let transitionClass;

		if (this.props.animationType === 'overlay') {
			transitionClass = 'Overlay';
		}

		if (this.props.animationType === 'underlay') {
			transitionClass = 'Underlay';
		}

		return (
			<div
				className={
					this.componentName + ' View ' + transitionClass + ' Load'
				}>
				<div className="ViewBox">
					<div className="Spacer" />
					<div className="PageTextContent">
						<div className="ContentItem">
							<div className="ContentItemTitle">
								<span className="Txt">Getting xDai</span>
							</div>
							<br />
							<div className="ContentItemContent">
								In order to keep transaction costs near to zero,
								use xDai to buy Punks or PUNK tokens. Using a
								new token can seem a little dawnting, however
								one of the big advantages about xDai that you
								may not know, is that you can purchase it easily
								with a bank card, or bridging from other
								networks.
								<br />
								<br />
								But before you do so, please ensure you have:
								<ul>
									<li>
										1.{' '}
										<a
											href="https://metamask.io/download"
											target="_blank"
											rel="noreferrer">
											Downloaded and setup MetaMask on
											your Chrome browser
										</a>
									</li>
									<li>
										2.{' '}
										<a
											href="https://www.xdaichain.com/for-users/wallets/metamask/metamask-setup#setting-up-metamask-for-xdaiAdded"
											target="_blank"
											rel="noreferrer">
											{' '}
											Added xDai Network to you Metamask
										</a>{' '}
										(to see xDai in your wallet)
									</li>
								</ul>
							</div>
							<div className="ContentItemSubTitle">
								<span className="Txt">Buy xDai</span>
							</div>

							<div className="ContentItemContent">
								To buy xDai with a Credit/Debit card o via bank
								deposit using{' '}
								<a
									target="_blank"
									rel="noreferrer"
									href="https://buy.ramp.network/?defaultAsset=xDAI">
									Ramp Network
								</a>
								.
							</div>
							<br />
							<div className="ContentItemSubTitle">
								<span className="Txt">
									Bridge from Ethereum
								</span>
							</div>

							<div className="ContentItemContent">
								You can bridge Dai from Ethereum Mainnet through
								the{' '}
								<a
									target="_blank"
									rel="noreferrer"
									href="https://bridge.xdaichain.com/">
									xDaiChain bridge
								</a>
								.
								<br />
							</div>
							<br />
							<div className="ContentItemSubTitle">
								<span className="Txt">
									Bridge from BSC, Polygon or Fantom
								</span>
							</div>

							<div className="ContentItemContent">
								xDai can be bridged from BSC, Polygon or Fantom
								through the{' '}
								<a
									target="_blank"
									rel="noreferrer"
									href="https://xpollinate.io/">
									xPollinate Bridge
								</a>
								.
								<br />
								<br />
								More info on xPollinate can be found{' '}
								<a
									target="_blank"
									rel="noreferrer"
									href="https://www.xdaichain.com/for-users/bridges/xdai-matic-connext-bridge">
									here
								</a>
								.
							</div>
						</div>

						<Footer />
					</div>
				</div>
			</div>
		);
	}
}

export default XDaiOnRamp;
