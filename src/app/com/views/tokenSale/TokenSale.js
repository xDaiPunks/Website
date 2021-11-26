/* eslint-disable array-callback-return */
import React, { PureComponent } from 'react';
import { BigNumber } from 'bignumber.js';

import Button from 'src/app/com/button/Button';
import Loader from 'src/app/com/loader/Loader';
import Footer from 'src/app/com/footer/Footer';
import CountDown from 'src/app/com/countDown/CountDown';

import AppService from 'src/app/services/AppService';
import ViewService from 'src/app/services/ViewService';
import PunkService from 'src/app/services/PunkService';
import EventService from 'src/app/services/EventService';
import RouteService from 'src/app/services/RouteService';
import ConfigService from 'src/app/services/ConfigService';
import UtilityService from 'src/app/services/UtilityService';
import TransitionService from 'src/app/services/TransitionService';

const appService = new AppService();
const viewService = new ViewService();
const punkService = new PunkService();
const eventService = new EventService();
const routeService = new RouteService();
const configService = new ConfigService();
const utilityService = new UtilityService();
const transitionService = new TransitionService();

class TokenSale extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
		};

		this.loader = React.createRef();

		this.componentName = 'TokenSale';

		this.guid = utilityService.guid();

		this.getData = this.getData.bind(this);
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
		const vm = this;
		const pageElement = $('.' + vm.componentName + '.View');

		vm.updateView();
		vm.setPageSize();

		vm.getData();
		vm.loader.current.showLoader(false);

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

		eventService.dispatchObjectEvent('set:view', this.componentName);
		transitionService.updateTransition(this.props, this.componentName);
	}

	componentDidUpdate() {
		viewService.resetScroll();
	}

	getData() {
		const vm = this;
		appService
			.getSaleData()
			.then((response) => {
				console.log('DONE');
				vm.loader.current.hideLoader(true);
			})
			.catch((responseError) => {
				console.log('ERRROR');
			});
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

		const vm = this;

		if (this.props.animationType === 'overlay') {
			transitionClass = 'Overlay';
		}

		if (this.props.animationType === 'underlay') {
			transitionClass = 'Underlay';
		}

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
								<div className="TokenSaleInfo">
									<div className="TokenSaleMain">
										<div className="TokenSaleItem">
											<span className="TokenSaleTitle">
												Token sale starts in
											</span>
											<span className="TokenSaleContent">
												<CountDown
													endDate={
														configService.countDownStart
													}
												/>
											</span>
										</div>
										<div className="TokenSaleSpacer" />
										<div className="TokenSaleItem">
											<span className="TokenSaleTitle">
												Currently raised
											</span>
											<span className="TokenSaleContent">
												Not started
											</span>
										</div>
									</div>
									<div className="TokenSaleSubMain">
										<div className="TokenSaleItem">
											<span className="TokenSaleTitle">
												Total supply
											</span>
											<span className="TokenSaleContent">
												50M PUNK
											</span>
										</div>
										<div className="TokenSaleSubItem">
											<span className="TokenSaleSubTitle">
												
											</span>
											<span className="TokenSaleSubContent">
											
											</span>
										</div>
									</div>
								</div>
								<div className="IntroText">
									<span className="IntroPunkText">
										<span className="TextDark">Token</span>
										<span className="TextDark"> sale</span>
									</span>
									<span className="IntroPunkSubText">
										Make sure that you have read all info of
										the token sale <br />
										before participating
									</span>
									<div className="HeaderButtonContainer">
										<Button
											type={'navigationButton'}
											label={'Participate in token sale'}
											title={'Contribute'}
											onClick={(event) => {
												event.preventDefault();
											}}
											cssClass={'NavigationButtonAction'}
											iconImage="/static/media/images/icon-wallet.svg"
										/>
									</div>
								</div>
								<div className="IntroBottomGradient" />
							</div>
							<div className="IntroContent">
								<div className="ContentBlock">
									<div id="PunkToken" className="BlockTitle">
										PUNK token
									</div>
									<div className="ContentItemContent"></div>
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

export default TokenSale;
