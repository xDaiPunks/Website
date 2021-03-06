/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';

import { BigNumber } from 'bignumber.js';

import Button from 'src/app/com/button/Button';
import Footer from 'src/app/com/footer/Footer';

import AppService from 'src/app/services/AppService';
import PunkService from 'src/app/services/PunkService';
import UserService from 'src/app/services/UserService';
import ViewService from 'src/app/services/ViewService';
import EventService from 'src/app/services/EventService';
import RouteService from 'src/app/services/RouteService';
import UtilityService from 'src/app/services/UtilityService';
import TransitionService from 'src/app/services/TransitionService';

const appService = new AppService();
const punkService = new PunkService();
const userService = new UserService();
const viewService = new ViewService();
const eventService = new EventService();
const routeService = new RouteService();
const utilityService = new UtilityService();
const transitionService = new TransitionService();

class Punk extends PureComponent {
	constructor(props) {
		super(props);

		this.punkId = null;
		this.punkDetails = null;

		this.state = {};
		this.componentName = 'Punk';

		this.guid = utilityService.guid();

		this.buy = this.buy.bind(this);
		this.enterBid = this.enterBid.bind(this);
		this.transferPunk = this.transferPunk.bind(this);
		this.offerForSale = this.offerForSale.bind(this);

		this.buyPunk = this.buyPunk.bind(this);
		this.acceptBid = this.acceptBid.bind(this);
		this.withdrawBid = this.withdrawBid.bind(this);
		this.removeOffer = this.removeOffer.bind(this);
		this.enterBidForPunk = this.enterBidForPunk.bind(this);
		this.offerPunkForSale = this.offerPunkForSale.bind(this);
		this.transferPunkAddress = this.transferPunkAddress.bind(this);

		this.extra = this.extra.bind(this);

		this.punkDataComponent = this.punkDataComponent.bind(this);
		this.punkButtonComponent = this.punkButtonComponent.bind(this);
		this.attributesComponent = this.attributesComponent.bind(this);

		this.initialize();
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

		eventService.dispatchObjectEvent('set:view', this.componentName);
		transitionService.updateTransition(this.props, this.componentName);

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
			if (eventData.idx && eventData.idx === vm.punkId) {
				this.setState(this.state);
				this.forceUpdate();
			}
		});
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

	initialize() {
		const vm = this;

		if (
			vm.props.match &&
			vm.props.match.params &&
			vm.props.match.params.id
		) {
			vm.punkId = vm.props.match.params.id;

			if (parseInt(vm.punkId) >= 10000) {
				vm.punkId = '';
				vm.punkDetails = {};
			}

			if (parseInt(vm.punkId) < 10000) {
				vm.punkDetails = punkService.getItem(vm.punkId);
			}
		} else {
			vm.punkId = '';
			vm.punkDetails = {};
		}
	}

	buy() {
		let idx;
		let minAmount;

		const vm = this;

		idx = vm.punkDetails.idx;

		if (vm.punkDetails.sale === true) {
			if (vm.punkDetails.saleData && vm.punkDetails.saleData.minValue) {
				minAmount = BigNumber(vm.punkDetails.saleData.minValue)
					.div(1e18)
					.toFixed(2);

				eventService.dispatchObjectEvent('show:modal', {
					type: 'buyModal',
					idx: idx,
					minAmount: minAmount,
					buyPunk: vm.buyPunk,
				});
			}
		}
	}

	enterBid() {
		let idx;
		const vm = this;

		idx = vm.punkDetails.idx;

		eventService.dispatchObjectEvent('show:modal', {
			type: 'bidModal',
			idx: idx,
			enterBidForPunk: vm.enterBidForPunk,
		});
	}

	transferPunk() {
		let idx;
		const vm = this;

		idx = vm.punkDetails.idx;

		eventService.dispatchObjectEvent('show:modal', {
			type: 'transferModal',
			idx: idx,
			transferPunkAddress: vm.transferPunkAddress,
		});
	}

	offerForSale() {
		let idx;

		const vm = this;

		idx = vm.punkDetails.idx;

		eventService.dispatchObjectEvent('show:modal', {
			type: 'offerModal',
			idx: idx,
			offerPunkForSale: vm.offerPunkForSale,
		});
	}

	buyPunk(amount) {
		let idx;

		const vm = this;

		idx = vm.punkDetails.idx;

		appService
			.buyPunk(idx, amount)
			.then((response) => {
				// console.log(response);
			})
			.catch((responseError) => {
				// console.log(responseError);
			});
	}

	acceptBid() {
		let idx;
		const vm = this;

		idx = vm.punkDetails.idx;

		appService
			.acceptBidForPunk(idx)
			.then((response) => {
				// console.log(response);
			})
			.catch((responseError) => {
				// console.log(responseError);
			});
	}

	withdrawBid() {
		let idx;

		const vm = this;

		idx = vm.punkDetails.idx;

		appService
			.withdrawBidForPunk(idx)
			.then((response) => {
				// console.log(response);
			})
			.catch((responseError) => {
				// console.log(responseError);
			});
	}

	removeOffer() {
		let idx;
		const vm = this;

		idx = vm.punkDetails.idx;

		appService
			.punkNoLongerForSale(idx)
			.then((response) => {
				// console.log(response);
			})
			.catch((responseError) => {
				// console.log(responseError);
			});
	}

	enterBidForPunk(amount) {
		let idx;
		const vm = this;

		idx = vm.punkDetails.idx;

		appService
			.enterBidForPunk(idx, amount)
			.then((response) => {
				// console.log(response);
			})
			.catch((responseError) => {
				// console.log(responseError);
			});
	}

	offerPunkForSale(amount) {
		let idx;

		const vm = this;
		idx = vm.punkDetails.idx;

		appService
			.offerPunkForSale(idx, amount)
			.then((response) => {
				// console.log(response);
			})
			.catch((responseError) => {
				// console.log(responseError);
			});
	}

	transferPunkAddress(address) {
		let idx;
		const vm = this;

		idx = vm.punkDetails.idx;

		appService
			.transferPunkAddress(idx, address)
			.then((response) => {
				// console.log(response);
			})
			.catch((responseError) => {
				// console.log(responseError);
			});
	}

	extra() {
		let owned;

		const vm = this;
		const owner = vm.punkDetails.owner;

		if (userService.userSignedIn === true) {
			if (owner.toLowerCase() === userService.address.toLowerCase()) {
				owned = true;
			}
		}

		if (!owned) {
			return null;
		} else {
			return (
				<div className="ViewBoxExtra">
					<div className="ViewBoxExtraContainer">
						<Button
							type={'actionButton'}
							label={'Transfer this Punk'}
							title={'Transfer this Punk'}
							onClick={(event) => {
								event.preventDefault();
								vm.transferPunk();
							}}
							cssClass={'ActionButton'}
						/>
					</div>
				</div>
			);
		}
	}

	punkDataComponent() {
		let punkValue;
		let punkBidValue;
		let punkSaleValue;

		const vm = this;

		const bid = vm.punkDetails.bid;
		const sale = vm.punkDetails.sale;
		const value = vm.punkDetails.value;
		const bidData = vm.punkDetails.bidData;
		const saleData = vm.punkDetails.saleData;

		const type = vm.punkDetails.type;
		const attributes = vm.punkDetails.attributes;
		const AttributesComponent = this.attributesComponent;

		punkBidValue = 'No bids';
		punkSaleValue = 'Not offered by owner';

		if (value) {
			punkValue = BigNumber(value).div(1e18).toFixed(2);
			punkValue += ' xDai';
		}

		if (bid === true) {
			if (bidData && bidData.value) {
				punkBidValue = BigNumber(bidData.value).div(1e18).toFixed(2);
				punkBidValue += ' xDai';
			}
		}

		if (sale === true) {
			if (saleData && saleData.minValue) {
				punkSaleValue = BigNumber(saleData.minValue)
					.div(1e18)
					.toFixed(2);

				punkSaleValue += ' xDai';
			}
		}

		return (
			<div className="PunkDetails">
				<div className="PunkDetailsBackground">
					<div className="PunkDetailItemContainer">
						<div className="PunkDetailItem AlignLeft">
							<span className="PunkDetailItemTitle">
								Last sale
							</span>
							<span className="PunkDetailItemContent">
								{punkValue}
							</span>
						</div>

						<div className="PunkDetailItem AlignRight">
							<span className="PunkDetailItemTitle">Bid</span>
							<span className="PunkDetailItemContent">
								{punkBidValue}
							</span>
						</div>
					</div>

					<div className="PunkDetailItemContainer">
						<div className="PunkDetailItem">
							<span className="PunkDetailItemTitle">
								Offered for
							</span>
							<span className="PunkDetailItemContent">
								{punkSaleValue}
							</span>
						</div>
					</div>

					<AttributesComponent type={type} attributes={attributes} />
				</div>
			</div>
		);
	}

	punkButtonComponent() {
		let owned;
		let isBidding;
		let punkBidValue;
		let punkSaleValue;

		const vm = this;

		const owner = vm.punkDetails.owner;

		const bid = vm.punkDetails.bid;
		const sale = vm.punkDetails.sale;
		const bidData = vm.punkDetails.bidData;
		const saleData = vm.punkDetails.saleData;

		if (userService.userSignedIn === true) {
			if (owner.toLowerCase() === userService.address.toLowerCase()) {
				owned = true;
			}
		}

		if (bid === true) {
			if (bidData && bidData.value) {
				punkBidValue = BigNumber(bidData.value).div(1e18).toFixed(2);

				if (userService.userSignedIn === true) {
					if (
						bidData.fromAddress.toLowerCase() ===
						userService.address.toLowerCase()
					) {
						isBidding = true;
					}
				}
			}
		}

		if (sale === true) {
			if (saleData && saleData.minValue) {
				punkSaleValue = BigNumber(saleData.minValue)
					.div(1e18)
					.toFixed(2);
			}
		}

		if (owned !== true) {
			if (isBidding !== true) {
				if (sale === false) {
					return (
						<div className="PunkDetailButtons">
							<div className="PunkDetailButtonContainer">
								<Button
									type={'actionButton'}
									label={'Enter a bid'}
									title={'Enter a bid'}
									onClick={(event) => {
										event.preventDefault();
										vm.enterBid();
									}}
									cssClass={'ActionButton'}
								/>
							</div>
						</div>
					);
				} else {
					return (
						<div className="PunkDetailButtons">
							<div className="PunkDetailButtonContainer Padding">
								<Button
									type={'actionButton'}
									label={'Buy punk'}
									title={'Buy punk'}
									onClick={(event) => {
										event.preventDefault();
										vm.buy();
									}}
									cssClass={'ActionButton'}
								/>
							</div>
							<div className="PunkDetailButtonContainer">
								<Button
									type={'actionButton'}
									label={'Enter a bid'}
									title={'Enter a bid'}
									onClick={(event) => {
										event.preventDefault();
										vm.enterBid();
									}}
									cssClass={'ActionButton'}
								/>
							</div>
						</div>
					);
				}
			} else {
				if (sale === false) {
					return (
						<div className="PunkDetailButtons">
							<div className="PunkDetailButtonContainer">
								<Button
									type={'actionButton'}
									label={'Withdraw bid'}
									title={'Withdraw bid'}
									onClick={(event) => {
										event.preventDefault();
										vm.withdrawBid();
									}}
									cssClass={'ActionButton'}
								/>
							</div>
						</div>
					);
				} else {
					return (
						<div className="PunkDetailButtons">
							<div className="PunkDetailButtonContainer Padding">
								<Button
									type={'actionButton'}
									label={'Buy punk'}
									title={'Buy punk'}
									onClick={(event) => {
										event.preventDefault();
										vm.buy();
									}}
									cssClass={'ActionButton'}
								/>
							</div>
							<div className="PunkDetailButtonContainer">
								<Button
									type={'actionButton'}
									label={'Withdraw bid'}
									title={'Withdraw bid'}
									onClick={(event) => {
										event.preventDefault();
										vm.withdrawBid();
									}}
									cssClass={'ActionButton'}
								/>
							</div>
						</div>
					);
				}
			}
		} else {
			if (bid !== true && sale !== true) {
				return (
					<div className="PunkDetailButtons">
						<div className="PunkDetailButtonContainer">
							<Button
								type={'actionButton'}
								label={'Offer for sale'}
								title={'Offer for sale'}
								onClick={(event) => {
									event.preventDefault();
									vm.offerForSale();
								}}
								cssClass={'ActionButton'}
							/>
						</div>
					</div>
				);
			} else {
				if (bid !== true && sale === true) {
					return (
						<div className="PunkDetailButtons">
							<div className="PunkDetailButtonContainer">
								<Button
									type={'actionButton'}
									label={'Remove offer'}
									title={'Remove offer'}
									onClick={(event) => {
										event.preventDefault();
										vm.removeOffer();
									}}
									cssClass={'ActionButton'}
								/>
							</div>
						</div>
					);
				}

				if (bid === true && sale !== true) {
					return (
						<div className="PunkDetailButtons">
							<div className="PunkDetailButtonContainer Padding">
								<Button
									type={'actionButton'}
									label={'Accept bid'}
									title={
										'Accept bid of ' +
										punkBidValue +
										' xDai'
									}
									onClick={(event) => {
										event.preventDefault();
										vm.acceptBid();
									}}
									cssClass={'ActionButton'}
								/>
							</div>
							<div className="PunkDetailButtonContainer">
								<Button
									type={'actionButton'}
									label={'Offer for sale'}
									title={'Offer for sale'}
									onClick={(event) => {
										event.preventDefault();
										vm.offerForSale();
									}}
									cssClass={'ActionButton'}
								/>
							</div>
						</div>
					);
				}

				if (bid === true && sale === true) {
					return (
						<div className="PunkDetailButtons">
							<div className="PunkDetailButtonContainer Padding">
								<Button
									type={'actionButton'}
									label={'Accept bid'}
									title={
										'Accept bid of ' +
										punkBidValue +
										' xDai'
									}
									onClick={(event) => {
										event.preventDefault();
										vm.acceptBid();
									}}
									cssClass={'ActionButton'}
								/>
							</div>
							<div className="PunkDetailButtonContainer">
								<Button
									type={'actionButton'}
									label={'Remove offer'}
									title={'Remove offer'}
									onClick={(event) => {
										event.preventDefault();
										vm.removeOffer();
									}}
									cssClass={'ActionButton'}
								/>
							</div>
						</div>
					);
				}
			}
		}
	}

	attributesComponent(props) {
		const vm = this;

		const type = props.type;
		const attributes = props.attributes;

		// console.log(attributes);
		return (
			<div className="PunkDetailItemAttributes">
				<div className="PunkDetailItemTitle">Type</div>
				<div className="PunkDetailItemAttribute">{type}</div>
				<div style={{ height: '10px' }} />
				<div className="PunkDetailItemTitle">Attributes</div>
				{attributes.map((item, index) => {
					return (
						<div
							className="PunkDetailItemAttribute"
							key={'row' + index}>
							{item}
						</div>
					);
				})}
			</div>
		);
	}

	componentWillUnmount() {
		const vm = this;
		eventService.off('resize', vm.guid);
		eventService.off('force:state', vm.guid);
		eventService.off('preloader:hide', vm.guid);
		eventService.off('change:language', vm.guid);
		eventService.off('change:punkData', vm.guid);
	}

	render() {
		let punkImageUrl;
		let transitionClass;

		const vm = this;

		const Extra = vm.extra;

		const PunkDataComponent = vm.punkDataComponent;
		const PunkButtonComponent = vm.punkButtonComponent;

		const idx = vm.punkDetails.idx;
		const rank = vm.punkDetails.rank;

		punkImageUrl = '/punks3d/' + vm.punkId + '_mask.png';

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
					<div className="Spacer"></div>
					<div className="PunkPositioner">
						<div className="PunkContainer">
							<div className="PunkItem">
								<div className="PunkItemOverlay">
									<div className="PunkDetailItem AlignLeft">
										<span className="PunkDetailItemTitle">
											Number
										</span>
										<span className="PunkDetailItemContent">
											{'#' + idx}
										</span>
									</div>

									<div className="PunkDetailItem AlignRight">
										<span className="PunkDetailItemTitle">
											Rank
										</span>
										<span className="PunkDetailItemContent">
											{rank}
										</span>
									</div>
								</div>
								<img
									alt={''}
									className={'PunkImageDetail'}
									src={punkImageUrl}
								/>
							</div>
						</div>
						<PunkDataComponent />
					</div>
					<PunkButtonComponent />
				</div>
				<Extra />
				<Footer />
			</div>
		);
	}
}

export default Punk;
