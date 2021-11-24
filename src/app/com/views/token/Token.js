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
import UtilityService from 'src/app/services/UtilityService';
import TransitionService from 'src/app/services/TransitionService';

const appService = new AppService();
const viewService = new ViewService();
const punkService = new PunkService();
const eventService = new EventService();
const routeService = new RouteService();
const utilityService = new UtilityService();
const transitionService = new TransitionService();

class Token extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};

		this.componentName = 'Token';

		this.guid = utilityService.guid();

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
									'url("/static/media/images/token-background.jpg")',
							}}>
							<div className="IntroTopGradient" />
							<div className="IntroText">
								<span className="IntroPunkText">
									<span className="TextDark">PUNK</span>
									<span className="TextLight"> token</span>
								</span>
								<span className="IntroPunkSubText">
									The basis of our community and the backbone
									for our upcoming marketplace. <br />
									Our token sale will start on December the
									1st
								</span>
								<div className="HeaderButtonContainer">
									<Button
										type={'actionButton'}
										label={'Read more'}
										title={'Read more'}
										onClick={(event) => {
											event.preventDefault();
											vm.scrollToContent();
										}}
										cssClass={'HeaderButtonAction'}
									/>
								</div>
							</div>
							<div className="IntroBottomGradient" />
						</div>
						<div className="IntroContent">
							<div className="ContentBlock">
								<div id="PunkToken" className="BlockTitle">PUNK token</div>
								<div className="ContentItemContent">
									xDaiPunks has become a community driven
									multifaceted NFT project. What started out
									as a 2d collection of 10.000 Punks quickly
									evolved into a community driven project that
									builds, owns governs projects that help to
									improve and reduce friction in the xDai NFT
									ecosystem. <br />
									<br />
									Our collection “bit-shifted” from 2d Punks
									to 3d Punks and now includes an open-source
									3d model. This model makes our collection
									ready for the metaverse. Next to that, we
									are building an OpenSea-like marketplace
									called NiftyFair. It uses a different
									business model that is both nifty and fair
									as we believe that royalties should belong
									to owners/creators and not to a marketplace.
									<br />
									<br />
									Everything we do as a community is tied
									together by the PUNK token. The PUNK token
									has 3 functions: vote, burn and vest.
									<br />
									<br />
									<span className="SubTitleInline">Vote</span>
									<br />
									xDaiPunks is a DAO and PUNK is our
									governance token. Holders can use it to vote
									on proposals that community members bring
									forward. Tools like gardens and snapshot
									will be used to manage our DAO and the PUNK
									token will give community members a voice
									<br />
									<br />
									<span className="SubTitleInline">Burn</span>
									<br />
									Currently we are building a new OpenSea-like
									marketplace called NiftyFair. As we have the
									goal to reduce friction in the xDai NFT
									ecosystem, NiftyFair will have a different
									business model. The revenue from the
									marketplace will come from listing and
									marketing fees. Revenue from the marketplace
									will be used to buy PUNK tokens in the open
									market and burn them.
									<br />
									<br />
									<span className="SubTitleInline">Vest</span>
									<br />
									50% of the total PUNK supply will be dropped
									on the Punk NFT collection. As a result,
									each Punk NFT will have 10k PUNK tokens
									locked-up. Through the vesting contract the
									locked-up tokens will be released over a
									period of 36 months. During this period,
									called the vesting period, the Punk owner
									can claim vested tokens. Tokens will be
									released every block, so in theory a Punk
									Hodler can claim newly released Punk tokens
									every block.
									<br />
									<br />
									Although the full 10K PUNK tokens will not
									be released immediately, the value of the
									PUNK tokens, which is the remaining claim,
									will be locked-up in the Punk NFT. This in
									theory should add value to the Punk NFT
									itself. The Punk NFTs are tradable and
									change in ownership during the vesting
									period also means change of ownership of the
									remaining claim.
									<br />
									<br />
									The vesting period will start 2 months after
									the token pre-sale. This to incentivize long
									term commitment into our project and to have
									our upcoming marketplace up and running to
									alleviate the inflation from the vested
									tokens.
								</div>
							</div>
							<div className="ContentBlock">
								<div className="BlockTitle">Marketplace</div>
								<a
									className="TextImage"
									href="/static/media/images/niftyfair-site.jpg"
									target="_blank">
									<img
										alt={''}
										className={'TextImageContent'}
										style={{ borderRadius: '25px' }}
										src={
											'/static/media/images/niftyfair-thumb.jpg'
										}
									/>
								</a>
								<div className="ContentItemContent">
									Our upcoming marketplace, called NiftyFair,
									is key to our tokenomics. The marketplace,
									which will live on the xDai blockchain, has
									the goal to create a friction-less
									experience for creating, minting and trading
									NFTs. Low gas fees and fast transaction
									times already reduce friction, but there is
									more.
									<br />
									<br />
									The revenue model of NiftyFair will be based
									on listing fees and promotion features. Why?
									Because we believe that a marketplace should
									never be a middle man and royalties should
									therefore never be the revenue model of a
									marketplace. On NiftyFair, royalties go to
									creators, owners or promotors. And this is
									what makes our marketplace fair.
									<br />
									<br />
									Furthermore, we have given a lot of thought
									on the features. On NiftyFair, you can
									easily create NFTs or even entire NFT
									collection without the need for writing
									smart contracts. Even an NFT drop is easily
									created. As a buyer your can easily message
									sellers to negotiate deals. And you have
									even the option to make a certain percentage
									of the sale price available to promotors to
									market your NFT or your NFT collection. This
									is what makes our marketplace nifty
									<br />
									<br />
									The backbone of NiftyFair is the PUNK token.
									Revenue generated by NiftyFair will be used
									to buy PUNK tokens on the open market. These
									tokens will be burned and as a result, the
									total supply of PUNK will decrease.
								</div>
							</div>
							<div className="ContentBlock">
								<div className="BlockTitle">Token supply</div>
								<div
									className="ContentItemContent"
									style={{ paddingBottom: '10px' }}>
									The total supply of PUNK is 200 million
									tokens. 50% of the total supply, that is 100
									million tokens, will be distributed to our
									vesting program. This means these tokens are
									locked until the vesting program starts. The
									vesting period will start after the token
									sale has been completed. This period starts
									with a grace period of 2 months.
								</div>
								<div className="TextImage">
									<img
										alt={''}
										className={'TextImageContent'}
										src={
											'/static/media/images/token-supply-chart.png'
										}
									/>
								</div>
								<div className="ContentItemContent">
									<span className="SubTitleInline">
										Token sale
									</span>
									<br />
									25% of the token supply will be used for the
									token sale. The token sale will start on
									December 1st through a so-called Initial
									Bond Curve Offering. You can find more
									details on the token sale below.
									<br />
									<br />
									<span className="SubTitleInline">
										Treasury
									</span>
									<br />
									20% of the token supply, that is 40 million
									tokens, will be distributed to our treasury.
									The treasury will be managed by the DAO. In
									the current proposal the tokens that will be
									available for the treasury will be
									distributed in the following way:
									<ul>
										<li>25% liquidity</li>
										<li>25% marketing</li>
										<li>25% development</li>
										<li>25% Emergency fund</li>
									</ul>
									<span className="SubTitleInline">Team</span>
									<br />
									5% of the token supply will be distributed
									to the team. 2% will be directly distributed
									and 3% will be linearly distributed over a
									period of 36 months.
									<br />
									<br />
									<span className="SubTitleInline">
										Vesting program
									</span>
									<br />
									50% of the total supply, that is 100 million
									tokens, will be distributed to Punk owners
									through the vesting program. The vesting
									program will airdrop 100 million tokens on
									the 10.000 Punk NFTs. These tokens will be
									locked-up. The unlocking of the locked
									tokens will be spread out over the vesting
									period of 36 months. A Punk owner can then
									claim the unlocked tokens.
									<br />
									<br />
									Every Punk NFT will 10.000 tokens locked-up.
									This means that value of the tokens is also
									locked-up in the Punk NFT. During the
									vesting period of 36 months a fraction of
									these tokens will be unlocked. This happens
									every block. Punk owners can claim unlocked
									tokens every block. All tokens will be
									unlocked when the vesting period ends.
									<br />
									<br />
									If a Punk is traded, the remaining locked
									and unclaimed tokens will transfer to the
									new owner. The new unlocked tokens as well
									as the unclaimed tokens can be claimed by
									the new owner. Although the value of the
									tokens is locked-up in the Punk NFT, the
									Punk NFTs themselves can be traded
								</div>
							</div>
							<div className="ContentBlock">
								<div className="BlockTitle">
									PUNK token sale
								</div>
								<div
									className="ContentItemContent"
									style={{ paddingBottom: '10px' }}>
									On December 1st, our token sale will start.
									25% off the total supply, that is 50 million
									PUNK tokens, will be available for this
									event. We wanted to create a token sale that
									is as fair as possible. That is why our
									token sale will be held through a so-called
									Initial Bond Curve Offering. An IBCO is not
									as complicated as it sounds. See the
									graphical example below.
								</div>
								<div className="TextImage">
									<img
										alt={''}
										className={'TextImageContent'}
										src={
											'/static/media/images/ibco-example-chart.png'
										}
									/>
								</div>
								<div className="ContentItemContent">
									<span className="SubTitleInline">
										IBCO explained
									</span>
									<br />
									An Initial Bond Curve Offering works as
									follows. A fixed amount of tokens is locked
									up in a smart contract. During a set
									timeframe, participants can contribute by
									sending funds to this contract. When the
									timeframe has passed the tokens are
									released, pro rata, to the participants.
									Because the amount of tokens is fixed, a
									price for the token is set. This is done by
									dividing the amount of tokens by the total
									amount of funds that are sent to the
									contract.
									<br />
									<br />
									In the graphical example above, there is a
									fixed amount of 1000 tokens and there are 4
									participants. The total of contributed funds
									is 100 xDai. When we divide that by the
									total supply of 1000 tokens, we get a token
									price of 0.1 xDai. The amount of tokens
									Participant 1 is able to claim is 250
									tokens. Participant 2 can claim 200 tokens,
									participant 3 can claim 500 tokens and
									participant 4 can claim 50 tokens.
									<br />
									<br />
									Why is an IBCO fair? Because an IBCO has the
									following properties:
									<br />
									<ul>
										<li>
											Same settlement price for everyone
										</li>
										<li>No front-running</li>
										<li>No pumps & dumps by whales</li>
										<li>No price manipulations</li>
										<li>
											Price increases with every purchase
										</li>
										<li>
											Collective, not competitive,
											contributions
										</li>
										<li>
											Pooling contributions in one batch
										</li>
									</ul>
									<br />
									<br />
									<span className="SubTitleInline">
										PUNK token sale
									</span>
									<br />
									On December 1st, our token sale will start.
									25% off the total supply, that is 50 million
									PUNK tokens, will be available for this
									event. The token sale will happen on the
									xDai blockchain. The token sale will last 7
									days. After 7 days, on the 8th of December,
									participants can claim their PUNK tokens.
									This claim is pro rata.
									<br />
									<br />
									A day after the token sale, liquidity will
									be provided on different decentralized
									exchanges with on xDai and on Ethereum
									Mainnet.
									<br />
									<br />
									The token sale requires no minimal
									contribution. Contributions are in xDai.
									Anyone can contribute confirming that they
									are not based in a jurisdiction where
									buying, trading and/or owning the PUNK token
									would be prohibited or restricted in any
									manner.
									<br />
									<br />
									<span className="SubTitleInline">
										Token sale legal notice
									</span>
									<br />
									Investment in a token sale entails risks of
									a partial or complete loss of the
									investment. No guarantee is given regarding
									the value of the tokens acquired in the
									offering and the exchange value of said
									tokens in legal currency. Tokens do not
									constitute financial instruments or
									securities tokens and confer no other right
									than those described. In addition, the
									regulatory framework applicable to the
									offering and to the tokens as well as the
									tax regime applicable to the holding of
									tokens are not defined to date in certain
									jurisdictions. Please consult your local tax
									and legal advisor before considering
									purchasing tokens or interacting with the
									protocol.
								</div>
							</div>
							<div className="ContentBlock">
								<div className="BlockTitle">Token release</div>
								<div className="TextImage">
									<img
										alt={''}
										className={'TextImageContent'}
										src={
											'/static/media/images/token-timeline-chart.png'
										}
									/>
								</div>

								<div className="ContentItemContent">
									<span className="SubTitleInline">
										Periods
									</span>
									<br />
									Our token sale will start on December 1st
									and will end on December 8th. After the
									token sale has ended a grace period of 2
									months will start. After the grace period,
									the vesting period will start for both the
									team and the Punk owners.
									<br />
									<br />
									The grace period and the vesting period
									still require DAO approval. The vote for
									this approval will be held in the first week
									of the grace period. This means that the
									grace period and the vesting period can
									change. The vote will include the
									participants of the token sale.
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
												DEX listings
											</span>
										</div>
									</div>
									<div className="RoadMapItem">
										<div className="RoadMapContainer">
											<span className="RoadMapTitle">
												January 15th 2022
											</span>
											<span className="RoadMapContent">
												Beta release NiftyFair
											</span>
										</div>
									</div>
									<div className="RoadMapItem">
										<div className="RoadMapContainer">
											<span className="RoadMapTitle">
												February 15th
											</span>
											<span className="RoadMapContent">
												Official release NiftyFair
											</span>
										</div>
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

export default Token;
