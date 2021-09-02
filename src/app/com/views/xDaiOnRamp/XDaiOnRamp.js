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
								<span className="TitleImageContent"></span>
							</div>
							<div className="ContentItemContent">
								xDai is the native currency of the xDai
								blockchain. So what is xDai? xDai is a stable
								coin that is soft pegged to the US Dollar. This
								currency is created by bridging the Dai
								cryptocurrency form the Ethereum mainnet to the
								xDai mainnet through a set of auditable smart
								contracts. This means that 1 xDai will always be
								one Dai
								<br />
								<br />
								There are 2 ways to get xDai in your wallet. An
								important thing to remember is that not all
								wallets support the xDai blockchain. MetaMask
								and Pillar are 2 of wallets that are supported
								you can get a list of supported wallets{' '}
								<a
									target="_blank"
									rel="noreferrer"
									href="https://www.xdaichain.com/for-users/wallets">
									here
								</a>
							</div>
						</div>

						<div className="ContentItem">
							<div className="ContentItemTitle">
								<span className="Txt">Ramp Network</span>
								<span className="TitleImageContent"></span>
							</div>
							<div className="ContentItemContent">
								If you want to directly on-ramp fiat currency
								then the xDai blockchain has got you covered.
								They have partnered with Ramp Network to provide
								a direct fiat to xDai gateway. The cool thing is
								that the fees of Ramp Network are very low, like
								in unbeatable low! You can on-ramp using debit
								cards of well know credit card issuers. Next to
								that you can even use Apple Pay for on-ramping.
								To do so, you can click{' '}
								<a
									target="_blank"
									rel="noreferrer"
									href="https://buy.ramp.network/?defaultAsset=xDAI">
									here
								</a>
							</div>
						</div>

						<div className="ContentItem">
							<div className="ContentItemTitle">
								<span className="Txt">xDai TokenBridge</span>
								<span className="TitleImageContent"></span>
							</div>
							<div className="ContentItemContent">
								What is cool about the xDai blockchain is that
								you can easily bridge Dai from the Ethereum
								mainnet to the xDai mainnet. This is done
								through the TokenBridge The bridge converts Dai
								into xDai. Once converted, xDai is used as a
								native token. When a user is finished using
								xDai, they can convert it back to Dai using the
								same bridge
								<br />
								<br />
								The bridge uses smart contracts on both chains
								to process transfers, and a group of validators
								confirm bridge transactions. When a bridge
								transfer is initiated, the specified amount of
								Dai is locked in a smart contract on the
								Ethereum mainnet, and the same amount of xDai is
								minted on the xDai chain and sent to the user's
								wallet on the xDai chain. When xDai is
								transferred back, xDai is burned, and the
								corresponding amount of Dai is unlocked in the
								contract and released to the user's wallet on
								the Ethereum mainnet. The bridge mechanism
								ensures that the amount of xDai can never exceed
								the amount of Dai locked in the bridge contract{' '}
								<br />
								<br />
								You can find the TokenBridge
								<a
									target="_blank"
									rel="noreferrer"
									href="https://bridge.xdaichain.com/">
									here
								</a>
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
