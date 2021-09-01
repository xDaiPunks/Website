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

class WalletTest extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};

		this.componentName = 'WalletTest';

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

		const introStartElement = $('.ViewBox .Intro .IntroStart');

		if (utilityService.browserSupport.mobileDevice === true) {
			innerHeight = windowInnerHeight;

			introStartElement[0].style.minHeight = innerHeight + 'px';
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

		const publicSale = punkService.publicSale;
		const mintsCount = punkService.mintsCount;

		// console.log(punkService.publicSale);
		// console.log(userService);

		if (publicSale !== true) {
			window.open('https://twitter.com/xDaiPunks');
		} else {
			if (mintsCount < 10000) {
				eventService.dispatchObjectEvent('show:modal', {
					type: 'mintModal',
					mintPunks: vm.mintPunks,
				});
			} else {
				routeService.navigateRoute('/marketplace');
			}
		}
	}

	subContentItem() {
		// const vm = this;

		const publicSale = punkService.publicSale;
		const mintsCount = punkService.mintsCount;

		// console.log('minstCount', mintsCount);

		// console.log('WalletTest publicSale', publicSale);
		// console.log('WalletTest mintscount', mintsCount);

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
		let number;
		let randomImage;

		let transitionClass;

		const vm = this;

		const SubContentItem = vm.subContentItem;
		const ButtonFooterItem = vm.buttonFooterItem;

		if (this.props.animationType === 'overlay') {
			transitionClass = 'Overlay';
		}

		if (this.props.animationType === 'underlay') {
			transitionClass = 'Underlay';
		}

		number = Math.floor(Math.random() * 9999);
		randomImage = '/punks/' + number + '.png';

		return (
			<div
				className={
					this.componentName + ' View ' + transitionClass + ' Load'
				}>
				<div className="ViewBox">
					<div className="Intro">
						<div className="IntroStart">
							<div className="IntroItem">
								<div className="PunkItem">
									<div className="PunkImage">
										<div className="PunkImageCircle">
											<img
												alt={''}
												className={'Punk'}
												src={randomImage}
											/>
										</div>
									</div>
									<span className="PunkText">
										<span className="TextDark">xDAI</span>
										<span className="TextLight">PUNKS</span>
									</span>
									<span className="PunkSubText">
										Here is your chance to own a genuine
										xDaiPunk!
									</span>
								</div>
								<div className="IntroSubContent">
									<SubContentItem />
								</div>
								<div className="IntroFooterContainer">
									<div className="FooterContainerSizer">
										<ButtonFooterItem />
									</div>
								</div>
							</div>
						</div>
						<div className="IntroContent">
							<div className="ContentItem">
								<div className="ContentItemTitle">
									<span className="Txt">
										xDAI
										<span className="Highlight">PUNKS</span>
									</span>
									<span className="TitleImageContent"></span>
								</div>
								<div className="ContentItemContent">
									The xDaiPunks are 10,000 unique Punks minted
									by the{' '}
									<a
										target="_blank"
										rel="noreferrer"
										href="https://blockscout.com/xdai/mainnet/address/0x9f0B5B31e7FBDe3D9B1aF4e482Ef262b4ae9Ed90/contracts">
										smart contract
									</a>{' '}
									on the xDai blockchain. The punks are
									so-called Non Fungible Tokens or NFT’s for
									short. All punks are unique and their
									genuineness is verifiable through the
									official{' '}
									<a
										target="_blank"
										rel="noreferrer"
										href="https://blockscout.com/xdai/mainnet/address/0x9f0B5B31e7FBDe3D9B1aF4e482Ef262b4ae9Ed90/contracts">
										smart contract
									</a>{' '}
									of xDaiPunks. The punks are not minted yet
									and here is the chance to own one of them!
									<br />
									<br />
									You can get a Punk by minting one for 12
									xDai. If the Punk you want is already minted
									you might still get it by placing a bid
									through the official xDaiPunks Marketplace.
									This marketplace is completely driven by the
									smart contract of xDai punks. On the
									marketplace you can trade Punks and Bid on
									punks you want to own. The marketplace will
									be live when the mining phase has started
								</div>
							</div>

							<div className="ContentItem">
								<div className="ContentItemTitle">
									<span className="Txt">Why?</span>
									<span className="TitleImageContent"></span>
								</div>
								<div className="ContentItemContent">
									The xDaiPunks project has the goal of
									showing the coolness of owning a NFT based
									Punk on the xDai blockchain. Because, well,
									Punks and NFT’s are cool! As we all know,
									the origins of the Non Fungible token lie in
									the CryptoPunk project. The last couple of
									years, CryptoPunks and NFT’s gained a lot of
									interest. NFT’s are collectible digital
									assets. They are unique and can’t be
									replaced with something else.
									<br />
									<br />
									The xDai blockchain is an EVM based
									blockchain that uses bridged Dai as currency
									for transactions and gas fees. This unique
									property makes transaction costs predictable
									and low.
									<br />
									<br />
									xDaiPunks shows what happens when NFT’s are
									used on the xDai blockchain. The minting,
									selling, bidding and buying of NFT’s work
									like they are supposed to work. With low
									costs for bidding and selling.
								</div>
							</div>

							<div className="ContentItem AlignCenter">
								<span className="BrightContent">
									PUNKS ARE NOW AVAILABLE ON xDAI
									<br />
									HERE IS YOUR CHANCE TO OWN ONE!
								</span>
							</div>

							<div className="ContentItem">
								<div className="ContentItemTitle">
									<span className="Txt">Genuineness</span>
									<span className="TitleImageContent"></span>
								</div>
								<div className="ContentItemContent">
									NFT’s are non-fungible. This means that they
									are unique and can’t be replaced with
									something else. This uniqueness is
									guaranteed by the underlying smart contract.
									This is quite a feat as , for example,
									cryptocurrencies are fungible. Trade one for
									another bitcoin, and you’ll have exactly the
									same thing.
									<br />
									<br />
									So how can you verify that your xDaiPunk is
									genuine? That is quite easy. The smart
									contract of your Punk has an embedded hash.
									This hash can be compared with the hash of
									the xDaiPunks image. If they are the same,
									then you own a genuine xDaiPunk. You can
									find the xDaiPunks image in our{' '}
									<a
										target="_blank"
										rel="noreferrer"
										href="https://blockscout.com/xdai/mainnet/address/0x9f0B5B31e7FBDe3D9B1aF4e482Ef262b4ae9Ed90/contracts">
										Github repository
									</a>{' '}
									. There you can also see how you generate
									the hash from the image through openssl.
								</div>
							</div>

							<div className="ContentItem">
								<div className="ContentItemTitle">
									<span className="Txt">Disclaimer</span>
									<span className="TitleImageContent"></span>
								</div>
								<div className="ContentItemContent">
									The xDaiPunks project is a showcase of the
									capabilities of the xDai blockchain.
									xDaiPunks is not in any shape way or form
									affiliated with CryptoPunks and LarvaLabs.
									xDaiPunks is a homage to CryptoPunks and a
									completely separate project. As such the
									value of a xDaiPunk is not related to the
									value of a CryptoPunk
									<br />
									<br />
									Furthermore we are not affiliated with the
									xDai blockchain. The xDaiPunks project
									originated to show that Non Fungible Tokens
									can be traded directly on chain without the
									need for intermediaries. We thank LarvaLabs
									and their CryptoPunk project for their hard
									work and for being the Godfathers of the Non
									Fungible Token.
								</div>
							</div>
						</div>
						<Footer />
					</div>
				</div>
			</div>
		);
	}
}

export default WalletTest;
