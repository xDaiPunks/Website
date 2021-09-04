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

class Home extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};

		this.componentName = 'Home';

		this.guid = utilityService.guid();

		this.getPunkAction = this.getPunkAction.bind(this);

		this.confettiItem = this.confettiItem.bind(this);
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

	confettiItem() {
		let number00 = Math.floor(Math.random() * 9999);
		let number01 = Math.floor(Math.random() * 9999);
		let number02 = Math.floor(Math.random() * 9999);
		let number03 = Math.floor(Math.random() * 9999);
		let number04 = Math.floor(Math.random() * 9999);
		let number05 = Math.floor(Math.random() * 9999);
		let number06 = Math.floor(Math.random() * 9999);
		let number07 = Math.floor(Math.random() * 9999);
		let number08 = Math.floor(Math.random() * 9999);
		let number09 = Math.floor(Math.random() * 9999);
		let number10 = Math.floor(Math.random() * 9999);
		let number11 = Math.floor(Math.random() * 9999);
		let number12 = Math.floor(Math.random() * 9999);

		let randomImage00 = '/punks/' + number00 + '.png';
		let randomImage01 = '/punks/' + number01 + '.png';
		let randomImage02 = '/punks/' + number02 + '.png';
		let randomImage03 = '/punks/' + number03 + '.png';
		let randomImage04 = '/punks/' + number04 + '.png';
		let randomImage05 = '/punks/' + number05 + '.png';
		let randomImage06 = '/punks/' + number06 + '.png';
		let randomImage07 = '/punks/' + number07 + '.png';
		let randomImage08 = '/punks/' + number08 + '.png';
		let randomImage09 = '/punks/' + number09 + '.png';
		let randomImage10 = '/punks/' + number10 + '.png';
		let randomImage11 = '/punks/' + number11 + '.png';
		let randomImage12 = '/punks/' + number12 + '.png';

		return (
			<div className="Confetti">
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage00}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage01}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage02}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage03}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage04}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage05}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage06}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage07}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage08}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage09}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage10}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage11}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage12}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}

	subContentItem() {
		// const vm = this;

		const publicSale = punkService.publicSale;
		const mintsCount = punkService.mintsCount;

		// console.log('minstCount', mintsCount);

		// console.log('Home publicSale', publicSale);
		// console.log('Home mintscount', mintsCount);

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
		const ConfettiItem = vm.confettiItem;
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
							<ConfettiItem />
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
									through the xDaiPunks Marketplace which is
									based on the smart contract of xDaiPunks. On
									the marketplace you can trade Punks and Bid
									on punks you want to own. The marketplace
									will be live when the mining phase has
									started
								</div>
							</div>

							<div className="ContentItem">
								<div className="ContentItemTitle">
									<span className="Txt">Why?</span>
									<span className="TitleImageContent"></span>
								</div>
								<div className="ContentItemContent">
									xDaiPunks has the goal of showcasing the
									Punks project on the xDai blockchain. Why?
									Well, because Punks are cool and NFT’s are
									cool. As we all know, the origins of the Non
									Fungible token lie in the CryptoPunk
									project. The last couple of years,
									CryptoPunks and NFT’s gained a lot of
									interest <br />
									<br />
									But things are not perfect. The majority of
									the marketplaces for NFT’s are based on
									Ethereum. Because of high gas fees, the
									experience is less than optimal. As Ethereum
									enthusiasts we are used to this. But if you
									look at the real world it is kind of odd to
									pay more than $10 USD for every time you
									raise your hand during an auction
									<br />
									<br />
									xDaiPunks has been built to show that things
									can be better. The low gas fees and the high
									transaction speed of the xDai blockchain
									make buying, selling, offering and bidding a
									breeze. That is why the marketplace will be
									live directly when the minting phase starts.
									The marketplace uses the underlying{' '}
									<a
										target="_blank"
										rel="noreferrer"
										href="https://blockscout.com/xdai/mainnet/address/0x9f0B5B31e7FBDe3D9B1aF4e482Ef262b4ae9Ed90/contracts">
										smart contract
									</a>{' '}
									directly which you can verify
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
									The value of a xDaiPunk is not related to
									the value of a CryptoPunk.
									<br />
									<br />
									xDaiPunks is a homage to the CryptoPunk
									project of LarvaLabs. With xDaiPunks we
									thank LarvaLabs for their pioneering and for
									creating the CryptoPunk project. The project
									that basically started the ever growing NFT
									movement
								</div>
							</div>

							<div className="ContentItem">
								<div className="ContentItemTitle">
									<span className="Txt">
										Why mint for 12 xDai?
									</span>
									<span className="TitleImageContent"></span>
								</div>
								<div className="ContentItemContent">
									The minting of xDaiPunks is set at 12 xDai.
									This means that during the initial minting
									phase, you will be able to generate a random
									punk for 12 xDai. When all 10,000 Punks are
									minted, you can get a Punk by using the
									marketplace.
									<br />
									<br />
									That the minting is set at 12 xDai has a
									couple of reasons. As you know, keeping up,
									maintaining and further developing a system
									costs money. We want to keep xDaiPunks
									running for years to come and we hope to
									integrate xDaiPunks with other NFT
									marketplaces in the near future. As the
									minting phase is the only source of revenue
									for this project, we have set the minting at
									this price
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

export default Home;
