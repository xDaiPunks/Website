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

class About extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};

		this.componentName = 'About';

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

		const punkElement = $('.ViewBox');

		if (utilityService.browserSupport.mobileDevice === true) {
			innerHeight = windowInnerHeight;

			punkElement[0].style.minHeight = innerHeight + 'px';
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
								<span className="Txt">About xDaiPunks</span>
							</div>
							<div className="ContentItemSubTitle">
								<span className="Txt">Our story</span>
							</div>
							<div className="ContentItemContent">
								xDaiPunks started as a collection of 10.000
								unique non-fungible tokens (NFTs) created in
								August 2021 on the xDai blockchain. In a matter
								of days a vibrant and active community formed
								with people from all over the world. As a result
								the minting phase, which started on 5 September
								at 23:55, sold out in 7 hours. As the
								marketplace was online from the get-go, trading
								of Punks started when the minting phase
								was still in progress.
								<br />
								<br />
								Within days, the xDaiPunk community started to
								share ideas on how to move the project forward. One of the first
								ideas was to make our beloved Punks more
								desirable and ready for the metaverse. As a
								result, our Punks “bit-shifted” to 3d Punks on
								November the 5th. (Remember, remember…) <br />
								<br />
								At the same time, efforts are being made to turn
								the xDaiPunk community into a DAO. In the
								very near future, the $PUNK token will be launched.
								This token will allow us to enter the next
								chapter of our existence - not only will our
								token be a governance token, it will also be a
								token that can be vested by xDaiPunk NFT
								hodlers. The token itself will be backed by the
								revenue of our upcoming NFT marketplace called
								NiftyFair. NiftyFair's goal is to reduce the
								friction in creating, minting and trading NFTs.
							</div>
						</div>

						<div className="ContentItem">
							<div className="ContentItemSubTitle">
								<span className="Txt">Our future</span>
							</div>
							<div className="ContentItemContent">
								Our community is moving mountains and things
								happen at light-speed. What we could only dream
								of a couple of months ago is now quickly
								becoming reality. Our goal of becoming a
								DAO will be achieved in a matter of weeks. The
								efforts of our community and the cooperation
								within the xDai ecosystem makes this
								possible.
								<br />
								<br />
								Not long from now, we will have a
								governance/vesting token and an NFT marketplace.
								And then comes the question what is next? Our
								Punks are ready to move from chain to chain and
								they are backed by an open-source 3d model. The
								metaverse is being created as we speak and the
								gardens walls are being torned down.
								<br />
								<br />
								This gives us new and really exciting
								opportunities. Next year we will see Punks
								crossing borders and entering new worlds. Worlds
								that our community and our ecosystem are
								creating. Worlds where people can meet, get
								together, celebrate, play games, gain knowledge
								and make friendships. And these worlds will not
								exist in a virtual form only. Our community of
								Punks will organize IRL events where you as a
								Punk hodler will get access to. And believe us,
								our events are going to “whip the lama’s ass” 🦙
							</div>
						</div>

						<Footer />
					</div>
				</div>
			</div>
		);
	}
}

export default About;
