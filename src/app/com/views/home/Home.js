import axios from 'axios';
import React, { PureComponent } from 'react';

import Footer from 'src/app/com/footer/Footer';
import Button from 'src/app/com/button/Button';
import CountDown from 'src/app/com/countDown/CountDown';

import AppService from 'src/app/services/AppService';
import UserService from 'src/app/services/UserService';
import ViewService from 'src/app/services/ViewService';
import PunkService from 'src/app/services/PunkService';
import EventService from 'src/app/services/EventService';
import RouteService from 'src/app/services/RouteService';
import ScrollService from 'src/app/services/ScrollService';
import ConfigService from 'src/app/services/ConfigService';
import UtilityService from 'src/app/services/UtilityService';
import TransitionService from 'src/app/services/TransitionService';
import TranslationService from 'src/app/services/TranslationService';

const appService = new AppService();
const userService = new UserService();
const viewService = new ViewService();
const punkService = new PunkService();
const eventService = new EventService();
const routeService = new RouteService();
const scrollService = new ScrollService();
const configService = new ConfigService();
const utilityService = new UtilityService();
const transitionService = new TransitionService();
const translationService = new TranslationService();

class Home extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};

		this.componentName = 'Home';

		this.guid = utilityService.guid();

		this.getPunkAction = this.getPunkAction.bind(this);

		this.confettiItem = this.confettiItem.bind(this);
		this.subContentItem = this.subContentItem.bind(this);
	}

	updateView() {
		viewService.resetScroll();
		viewService.setViewSpacing();
		viewService.updateScrollWidth();
	}

	componentDidMount() {
		const vm = this;
		const pageElement = $('.' + vm.componentName + '.View');

		vm.updateView();

		eventService.on('resize', vm.guid, () => {
			setTimeout(() => {}, 10);
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

	mintPunks(amount) {
		appService
			.mintPunks(amount)
			.then((response) => {
				console.log(response);
				if (response.status !== true) {
					// show alert
				} else {
					routeService.navigateRoute('my-account');
				}
			})
			.catch((responseError) => {
				console.log(responseError);
			});
	}

	getPunkAction() {
		const vm = this;

		console.log(punkService.publicSale);
		console.log(userService);
		//FOR TESTING!!!!
		punkService.publicSale = true;

		if (punkService.publicSale !== true) {
			console.log('show modal not started');

			eventService.dispatchObjectEvent('show:modal', {
				type: 'alertModal',
				header: 'Minting not started',
				content:
					'The minting of xDaiPunks has not started yet. It will start soon',
				buttonText: translationService.translate(
					'modal.error.okbutton'
				),
			});
		}

		if (punkService.publicSale === true) {
			if (userService.userSignedIn === true) {
				eventService.dispatchObjectEvent('show:modal', {
					type: 'mintModal',
					mintPunks: vm.mintPunks,
				});
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
		const vm = this;

		const publicSale = punkService.publicSale;
		const mintsCount = punkService.mintsCount;

		console.log('minstCount', mintsCount);

		console.log('Home publicSale', publicSale);
		console.log('Home mintscount', mintsCount);

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
									</div>
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
