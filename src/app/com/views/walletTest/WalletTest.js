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
						<Footer />
					</div>
				</div>
			</div>
		);
	}
}

export default WalletTest;
