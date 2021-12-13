/* eslint-disable array-callback-return */
import React, { PureComponent } from 'react';
import { BigNumber } from 'bignumber.js';

import Footer from 'src/app/com/footer/Footer';
import Button from 'src/app/com/button/Button';

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

class Home extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};

		this.componentName = 'Home';

		this.guid = utilityService.guid();
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
			<div
				className={
					this.componentName + ' View ' + transitionClass + ' Load'
				}>
				<div className="ViewBox">
					<div className="Intro">
						<div
							className="IntroStart"
							style={{
								backgroundImage:
									'url("/static/media/images/intro-background.jpg")',
							}}>
							<div className="IntroTopGradient" />
							<div className="IntroText">
								<span className="IntroPunkText">
									<span className="TextDark">xDai</span>
									<span className="TextLight">Punks</span>
								</span>
								<span className="IntroPunkSubText">
									xDaiPunks is a collection of 3D Punk NFTs, a
									vibrant community and much more. <br />
									Be ready for the metaverse and get your NFT
									or Token now!
								</span>
								<div className="HeaderButtonContainer">
									<Button
										type={'navigationButton'}
										label={'Claim PUNK'}
										title={'Claim PUNK'}
										onClick={(event) => {
											event.preventDefault();
											routeService.navigateRoute(
												'/token-sale'
											);
										}}
										cssClass={'NavigationButtonAction'}
										iconImage="/static/media/images/icon-wallet.svg"
									/>
								</div>
							</div>
							<img
								alt={''}
								className={'IntroAstronaut'}
								src={'/static/media/images/astronaut.png'}
							/>
							<div className="IntroBottomGradient" />
						</div>
						<div className="IntroContent">
							<div className="ContentBlock">
								<div className="BlockTitle">xDaiPunks</div>
								<div className="ContentItemContent">
									xDaiPunks is a collection of 3D Punk NFTs
									that lives on the xDai blockchain. Your
									xDaiPunk doubles as a membership to our
									vibrant community. Owning a Punk also allows
									you to vest the upcomming $PUNK token.
									<br />
									<br />
									The Punks have been created using our Punk
									3d model. This model is open-source and will
									be used to let our xDaiPunks enter the
									metaverse
									<br />
									<br />
									In the near future, our community will also
									launch a new NFT marketplace named NiftyFair
									- a marketplace that will not charge
									royalties for every sale. We believe
									royalties should belong to creators or
									owners. A marketplace owned and governed by
									a bunch of Punks!
								</div>
							</div>
							<div className="ContentBlock">
								<div
									className="BlockTitle"
									style={{ paddingBottom: '15px' }}>
									xDaiPunks Roadmap
								</div>

								<div className="ContentItemRoadmap">
									<div className="RoadMapItem">
										<div className="RoadMapContainer">
											<span className="RoadMapTitle">
												September 5th 2021
											</span>
											<span className="RoadMapContent">
												NFT Drop
											</span>
										</div>
									</div>
									<div className="RoadMapItem">
										<div className="RoadMapContainer">
											<span className="RoadMapTitle">
												November 5th 2021
											</span>
											<span className="RoadMapContent">
												Release 3d Punks
											</span>
										</div>
									</div>
									<div className="RoadMapItem">
										<div className="RoadMapContainer">
											<span className="RoadMapTitle">
												December 1st 2021
											</span>
											<span className="RoadMapContent">
												Start PUNK token sale
											</span>
										</div>
									</div>
									<div className="RoadMapItem">
										<div className="RoadMapContainer">
											<span className="RoadMapTitle">
												December 9th 2021
											</span>
											<span className="RoadMapContent">
												DEXs listing
											</span>
										</div>
									</div>
									<div className="RoadMapItem">
										<div className="RoadMapContainer">
											<span className="RoadMapTitle">
												January 15th 2022
											</span>
											<span className="RoadMapContent">
												Beta release of NiftyFair
											</span>
										</div>
									</div>
									<div className="RoadMapItem">
										<div className="RoadMapContainer">
											<span className="RoadMapTitle">
												February 15th
											</span>
											<span className="RoadMapContent">
												Official release of NiftyFair
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}

export default Home;
