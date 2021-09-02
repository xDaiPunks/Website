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
									Using the marketplace
								</span>
								<span className="TitleImageContent"></span>
							</div>
							<div className="ContentItemContent">
								The cool thing about xDaiPunks is that it has an
								integrated marketplace. The marketplace uses the
								underlying{' '}
								<a
									target="_blank"
									rel="noreferrer"
									href="https://blockscout.com/xdai/mainnet/address/0x9f0B5B31e7FBDe3D9B1aF4e482Ef262b4ae9Ed90/contracts">
									smart contract
								</a>{' '}
								directly which you can verify. On the
								marketplacve you can offer Punks for sale, place
								a bid for a Punk, Buy a Punk and accept a bid
								for a Punk. So what are the basic functions of
								the marketplace?
							</div>
						</div>

						<div className="ContentItem">
							<div className="ContentItemTitle">
								<span className="Txt">
									Offering a punk for sale
								</span>
								<span className="TitleImageContent"></span>
							</div>
							<div className="ContentItemContent">
								You can offer your punk for sale at a minimum
								price. To do so, just connect your wallet and go
								to 'My Account'. Here you see which Punks you
								own and on which Punks you have placed a bid
								<br />
								<br />
								Click on the Punk you own and click on 'Offer
								for sale'. A popup will show where you can enter
								the minimum amount for which you want to sell
								you punk. After clicking 'Ok' you will need to
								approve the transaction in your wallet. As you
								can see the transaction costs are very low
							</div>
						</div>

						<div className="ContentItem">
							<div className="ContentItemTitle">
								<span className="Txt">Removing the offer</span>
								<span className="TitleImageContent"></span>
							</div>
							<div className="ContentItemContent">
								Connect your wallet and go to 'My Account'. Your
								punk will have the status of 'Sale' when you
								have offered it for sale. Click on the punk and
								after that click on the 'Remove offer' button.
								After clicking you will need to approve the
								transaction in your wallet
							</div>
						</div>

						<div className="ContentItem">
							<div className="ContentItemTitle">
								<span className="Txt">Bidding for a Punk</span>
								<span className="TitleImageContent"></span>
							</div>
							<div className="ContentItemContent">
								When a punk has been minted, it will receive the
								status 'Market'. This status means that you can
								place a bid for this Punk. It does not matter if
								the owner has offered the punk for sale or not.
								You can always bid on a minted Punk.
								<br />
								<br />
								To place a bid, just select the Punk from the
								market place. Now click the 'Enter a bid'
								button. A pop-up will show where you can enter
								the bid amount. Of course the higher the bid the
								higher the chance that the owner will accept it.
								If you click 'Ok' the transaction will be sent
								to your connected wallet.
								<br />
								<br />
								Important to know is that a bid means that you
								send the bid amount to the smart contract. This
								amount will be deducted from your funds and will
								be locked up in the contract. So bids are quite
								serious, but you can always withdraw your bid
								<br />
								<br />
								2 things can happen from now on. Either the
								owner accepts the bid and you will receive
								ownership of the Punk. Or, someone else will bid
								higher and your bid will be removed
								<br />
								<br />
								If this happens, and this is important, the
								amount of your bid will not be be sent
								automatically to your wallet. Instead it will be
								made available to withdraw. You can see this
								amount on the 'My Account' page. To receive this
								amount you click the 'withdraw button'
							</div>
						</div>

						<div className="ContentItem">
							<div className="ContentItemTitle">
								<span className="Txt">Removing a bid</span>
								<span className="TitleImageContent"></span>
							</div>
							<div className="ContentItemContent">
								When you want to remove a bid for a Punk, go to
								your account page. The Punks that you have bid
								for will be listed here. Click on the punk and
								click 'Withdraw bid'
								<br />
								<br />
								Once you have approved the transaction, the bid
								amount will be available to withdraw. You can do
								so from your account page
							</div>
						</div>

						<div className="ContentItem">
							<div className="ContentItemTitle">
								<span className="Txt">Accepting a bid</span>
								<span className="TitleImageContent"></span>
							</div>
							<div className="ContentItemContent">
								When someone has place a bid on one of your
								punks, it will recieve the status 'Bid' or 'Sale
								& Bid'. People can always bid on your punk, even
								if you have not offered it for sale yet. If you
								offered it for sale at a certain price, people
								can always bid a lower price. That is called
								price discovery ;)
								<br />
								<br />
								You can see this status on your account page. To
								accept a bid, the only thing you have to do is
								click on the Punk and click on the 'Accept bid'
								button. After you have approved the transaction,
								the ownership of your Punk will be transferred
								and the bid amount will be available to withdraw
							</div>
						</div>

						<div className="ContentItem">
							<div className="ContentItemTitle">
								<span className="Txt">Outright buy a Punk</span>
								<span className="TitleImageContent"></span>
							</div>
							<div className="ContentItemContent">
								If a punk has been offerd for sale, you can
								outright buy the punk. Buying the punk means
								that you need to meet the minimum price of the
								Punk. But you can also offer more, that is up to
								you.
								<br />
								<br />
								Doing so is easy. Go to the marketplace and
								select the Punk you want with the 'Sale' status.
								Click on the punk and click on the button 'Buy
								punk'. A pop-up will appear where the minimum
								sale price will be shown. You can either click
								'Ok' or change the price to a higher price if
								your want. Everybody has their reasons so to say
								;)
								<br />
								<br />
								After you click 'Ok' you will need to approve
								the transaction. If all goes well, you will
								recieve ownership of the Punk. Your punk will be
								listed on the 'My account page'
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
