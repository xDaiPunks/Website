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

class MintHelp extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};

		this.componentName = 'MintHelp';

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

		// console.log('MintHelp publicSale', publicSale);
		// console.log('MintHelp mintscount', mintsCount);

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
								<span className="Txt">How to mint a Punk</span>
								<span className="TitleImageContent"></span>
							</div>
							<div className="ContentItemContent">
								When the minting phase has started, you will be
								able to mint one or more Punks for 12 xDai. The
								Punks will be minted randomly so you do not know
								which Punk you are going to mint
								<br />
								<br />
								Minting a Punk is quite easy. It is a matter of
								pressing a button. Selecting how many Punks you
								want to mint and confirming the resulting
								transaction in MetaMask. Below you will find a
								step by step guide
							</div>
						</div>

						<div className="ContentItem">
							<div className="ContentItemTitle">
								<span className="Txt">
									1. Connect your wallet
								</span>
								<span className="TitleImageContent"></span>
							</div>
							<div className="ContentItemContent">
								You connect your wallet by pressing the 'Connect
								wallet' button. If it is the first time you are
								connecting your wallet, a pop-up is shown asking
								you if you want to connect using MetMask or
								WalletConnect. On mobile devices you can only
								select WalletConnect
								<br />
								<br />
								We advise you to use MetaMask. This as the
								reliability of MetaMask is better and that is
								key during the minting phase
								<br />
								<br />
								If you click the MetaMask button, your MetaMask
								plugin will ask you to connect. Then click next
								with your account selected. And then click
								connect. Your wallet is now connected and the
								button 'Connect wallet' has chenged in 'My
								account'
							</div>
						</div>

						<div className="ContentItem">
							<div className="ContentItemTitle">
								<span className="Txt">
									2. Click Mint Button
								</span>
								<span className="TitleImageContent"></span>
							</div>
							<div className="ContentItemContent">
								When the minting phase has started you will see
								the 'Get a Punk for 12 xDai' button on the
								homepage. If you click that button, a pop-up
								will appear where you can fill in the amount of
								Punks you want. Then click 'Get punks'
								<br />
								<br />
								The maximum you can enter in the field is 20.
								That is 20 xDaiPunks per transaction. You can do
								multiple transactions and there is no limit on
								the amount of xDaiPunks you can mint
							</div>
						</div>

						<div className="ContentItem">
							<div className="ContentItemTitle">
								<span className="Txt">
									3. Confirm the transaction
								</span>
								<span className="TitleImageContent"></span>
							</div>
							<div className="ContentItemContent">
								After you have clicked the 'Get punks' button in
								the pop-up, your MetaMask plugin will ask you to
								confirm the transaction. The amount you see in
								xDai is the total amount for minting one or more
								xDaiPunks
								<br />
								<br />
								Check if the address is the contract address:
								<br />
								0x9f0B5B31e7FBDe3D9B1aF4e482Ef262b4ae9Ed90{' '}
								<br />
								<br />
								Now click confirm to confirm the transaction.
								Your xDaiPunks will now be minted. When the
								transaction is successfull, the minted punks
								will show in your account
							</div>
						</div>

						<Footer />
					</div>
				</div>
			</div>
		);
	}
}

export default MintHelp;
