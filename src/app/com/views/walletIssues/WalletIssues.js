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

class WalletIssues extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};

		this.componentName = 'WalletIssues';

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

		// console.log('WalletIssues publicSale', publicSale);
		// console.log('WalletIssues mintscount', mintsCount);

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
								<span className="Txt">
									WalletConnect Issues
								</span>
								<span className="TitleImageContent"></span>
							</div>
							<div className="ContentItemContent">
								xDaiPunks offers you to connect your wallet
								through WalletConnect. WalletConnnect is a great
								project, especially when connecting your wallet
								from a mobile device
								<br />
								<br />
								But using WalletConnect does come with its fair
								share of issues. As you can imagine bridging
								your wallet through a websocket connection to
								other devices is techically very challenging.
								Connections can fail, wallet software might not
								be working as should, devices might not be
								connected anymore and so on. So sometimes,
								WalletConnect just does not work
							</div>
						</div>

						<div className="ContentItem">
							<div className="ContentItemTitle">
								<span className="Txt">
									Cannot connect my wallet
								</span>
								<span className="TitleImageContent"></span>
							</div>
							<div className="ContentItemContent">
								This can happen. The thing is, when you use
								WalletConnect, sometimes patience is key. If you
								click the WalletConnect button, you sometimes
								need to wait a bit for the confirmation message
								to appear in your wallet. Also the approval
								sometimes takes time
								<br />
								If it just does not work you can try to clear
								your cache and try again. WalletConnect stores a
								localStorage variable that prevents you from
								connecting over and over again. Sometimes a
								connectionn just stays in a unusable state and
								clear this property will let you reconnect your
								wallet again
							</div>
						</div>

						<div className="ContentItem">
							<div className="ContentItemTitle">
								<span className="Txt">
									Transaction not showing
								</span>
								<span className="TitleImageContent"></span>
							</div>
							<div className="ContentItemContent">
								When your wallet is connected and you want to do
								something on the marketplace, the transaction
								confirmation message does not show in your
								wallet
								<br />
								<br />
								Again, when this happens, patience is key.
								Sometimes it just takes a while for the message
								to show. If still nothing happens, the best way
								to reconnect is to go to the 'My Account' page.
								You will see the disconnect button. Click on it
								and your wallet will be disconnected the proper
								way
								<br />
								<br />
								Now try to reconnect using WalletConnect again
								and try to make a transaction again. This
								usually soves the issue. If you still are unable
								to approve a transaction, you can try to clear
								your cache. The problem is that sometimes your
								connection will stay in an unusable state and
								clearing your cache can sometimes resolve this
								If this always still fails, there is always the
								desktop with a MetMask plugin in your browser to
								resort to. That will always work
							</div>
						</div>

						<Footer />
					</div>
				</div>
			</div>
		);
	}
}

export default WalletIssues;
