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

class TradePunk extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};

		this.componentName = 'TradePunk';

		this.guid = utilityService.guid();

		this.getPunkAction = this.getPunkAction.bind(this);

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
								<span className="Txt">Trade PUNK</span>
							</div>
							<br />
							<div className="ContentItemContent">
								Our PUNK token can now be traded on different
								exchanges. Because of the high gas fees, the
								current exchanges that can be used to trade PUNK
								use the xDai blockchain. Before you start
								trading, make sure you have:
								<br />
								<br />
								<ul>
									<li>
										<a
											href="https://metamask.io/download"
											target="_blank"
											rel="noreferrer">
											Downloaded and setup MetaMask
										</a>
									</li>
									<li>
										<a
											href="https://www.xdaichain.com/for-users/wallets/metamask/metamask-setup#setting-up-metamask-for-xdaiAdded"
											target="_blank"
											rel="noreferrer">
											Added the xDai Network to your
											Metamask wallet
										</a>
									</li>
									<li>
										<a
											href="https://metamask.zendesk.com/hc/en-us/articles/360015489031-How-to-add-unlisted-tokens-custom-tokens-in-MetaMask"
											target="_blank"
											rel="noreferrer">
											Added the PUNK token to your assets
											on the xDai network
										</a>
									</li>
									<li>
										<span
											style={{
												color: '#00f5f5',
											}}>
											Use contract address:
											0x988d1Be68F2C5cDE2516a2287c59Bd6302b7D20D
										</span>
									</li>
								</ul>
							</div>
							<div className="ContentItemSubTitle">
								<span className="Txt">Use HoneSwap</span>
							</div>

							<div className="ContentItemContent">
								HoneySwap is the biggest decentralized exchange
								on xDai. The PUNK token has sufficient liquidity
								and swapping is easy:
								<br />
								<br />
								<a
									target="_blank"
									rel="noreferrer"
									href="https://app.honeyswap.org/#/swap?outputCurrency=0x988d1be68f2c5cde2516a2287c59bd6302b7d20d&chainId=100">
									HoneySwap
								</a>
							</div>
							<br />
							<br />
							<div className="ContentItemSubTitle">
								<span className="Txt">
									MEV protection? Use CowSwap
								</span>
							</div>

							<div className="ContentItemContent">
								A big problem from a trading perspective is
								so-called Miner Extractable Value or MEV for
								short. MEV-type value extraction, executed by
								miners who hold sole power to organize
								transactions within a block, is endemic due to
								the Ethereum Virtual Machine (EVM) mempool
								design. This element of mempool design has
								garnered the Cixin Lin-inspired nickname "the
								dark forest," a side effect of the EVM
								architecture that goes unnoticed by most users
								<br />
								<br />
								In a nutshell, every transaction on EVM
								compatible blockchains submitted to the chain is
								monitored to check if there’s a possibility of
								taking advantage of it. It’s in the dark forest
								that the mainstream Ethereum community learned
								there is often an adversarial relationship
								between users and miners. The MEV "dark forest"
								gives rise to two intertwined problems:
								<br />
								<br />
								<ul>
									<li>
										DeFi users are constantly suffering from
										all types of MEV, such as front-running
										attacks that end up making the users'
										transactions fail even though they paid
										to execute them, or back-running attacks
										where the users get value extracted from
										their operations solely because the
										miners are in a privileged position
									</li>
									<li>
										Even when a transaction tries to prevent
										a possible protocol exploit, it can
										still lead to a bigger problem because
										the existence of the transaction itself
										signals the protocol weakness to
										everyone else
									</li>
								</ul>
								CowSwap is the first trading interface built on
								top of Gnosis Protocol v2. It allows you to buy
								and sell tokens using gas-less orders that are
								settled peer-to-peer among its users or into any
								on-chain liquidity source while providing MEV
								protection: <br />
								<br />
								<a
									target="_blank"
									rel="noreferrer"
									href="https://cowswap.exchange/#/swap?outputCurrency=0x988d1be68f2c5cde2516a2287c59bd6302b7d20d&chainId=100">
									CowSwap Exchange
								</a>
							</div>
						</div>

						<Footer />
					</div>
				</div>
			</div>
		);
	}
}

export default TradePunk;
