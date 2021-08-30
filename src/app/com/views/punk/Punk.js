import React, { PureComponent } from 'react';

import { BigNumber } from 'bignumber.js';

import Button from 'src/app/com/button/Button';
import Footer from 'src/app/com/footer/Footer';

import AppService from 'src/app/services/AppService';
import PunkService from 'src/app/services/PunkService';
import UserService from 'src/app/services/UserService';
import ViewService from 'src/app/services/ViewService';
import EventService from 'src/app/services/EventService';
import ScrollService from 'src/app/services/ScrollService';
import UtilityService from 'src/app/services/UtilityService';
import TransitionService from 'src/app/services/TransitionService';
import TranslationService from 'src/app/services/TranslationService';

const appService = new AppService();
const punkService = new PunkService();
const userService = new UserService();
const viewService = new ViewService();
const eventService = new EventService();
const utilityService = new UtilityService();
const transitionService = new TransitionService();
const translationService = new TranslationService();

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
		this.offerForSale = this.offerForSale.bind(this);

		this.buyPunk = this.buyPunk.bind(this);
		this.acceptBid = this.acceptBid.bind(this);
		this.withdrawBid = this.withdrawBid.bind(this);
		this.removeOffer = this.removeOffer.bind(this);
		this.enterBidForPunk = this.enterBidForPunk.bind(this);
		this.offerPunkForSale = this.offerPunkForSale.bind(this);

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
		let minAmount;

		const vm = this;
		const idx = vm.punkDetails.idx;

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
		const vm = this;
		const idx = vm.punkDetails.idx;

		eventService.dispatchObjectEvent('show:modal', {
			type: 'bidModal',
			idx: idx,
			enterBidForPunk: vm.enterBidForPunk,
		});
	}

	offerForSale() {
		const vm = this;
		const idx = vm.punkDetails.idx;

		eventService.dispatchObjectEvent('show:modal', {
			type: 'offerModal',
			idx: idx,
			offerPunkForSale: vm.offerPunkForSale,
		});
	}

	buyPunk(amount) {
		const vm = this;
		const idx = vm.punkDetails.idx;

		console.log(idx, amount);
		appService
			.buyPunk(idx, amount)
			.then((response) => {
				console.log(response);
			})
			.catch((responseError) => {
				console.log(responseError);
			});
	}

	acceptBid() {
		const vm = this;
		const idx = vm.punkDetails.idx;

		appService
			.acceptBidForPunk(idx)
			.then((response) => {
				console.log(response);
			})
			.catch((responseError) => {
				console.log(responseError);
			});
	}

	withdrawBid() {
		const vm = this;
		const idx = vm.punkDetails.idx;

		appService
			.withdrawBidForPunk(idx)
			.then((response) => {
				console.log(response);
			})
			.catch((responseError) => {
				console.log(responseError);
			});
	}

	removeOffer() {
		const vm = this;
		const idx = vm.punkDetails.idx;

		appService
			.punkNoLongerForSale(idx)
			.then((response) => {
				console.log(response);
			})
			.catch((responseError) => {
				console.log(responseError);
			});
	}

	enterBidForPunk(amount) {
		const vm = this;
		const idx = vm.punkDetails.idx;

		console.log(idx, amount);
		appService
			.enterBidForPunk(idx, amount)
			.then((response) => {
				console.log(response);
			})
			.catch((responseError) => {
				console.log(responseError);
			});
	}

	offerPunkForSale(amount) {
		const vm = this;
		const idx = vm.punkDetails.idx;

		console.log(idx, amount);
		appService
			.offerPunkForSale(idx, amount)
			.then((response) => {
				console.log(response);
			})
			.catch((responseError) => {
				console.log(responseError);
			});
	}

	punkDataComponent() {
		let punkValue;
		let punkBidValue;
		let punkSaleValue;

		const vm = this;
		console.log(vm.punkId);
		console.log(vm.punkDetails);

		const idx = vm.punkDetails.idx;
		const bid = vm.punkDetails.bid;
		const sale = vm.punkDetails.sale;
		const value = vm.punkDetails.value;
		const bidData = vm.punkDetails.bidData;
		const saleData = vm.punkDetails.saleData;

		const attributes = vm.punkDetails.attributes;

		const AttributesComponent = this.attributesComponent;

		if (value) {
			punkValue = BigNumber(value).div(1e18).toFixed(2);
		}

		if (bid === true) {
			if (bidData && bidData.value) {
				punkBidValue = BigNumber(bidData.value).div(1e18).toFixed(2);
			}
		}

		if (sale === true) {
			if (saleData && saleData.minValue) {
				punkSaleValue = BigNumber(saleData.minValue)
					.div(1e18)
					.toFixed(2);
			}
		}

		console.log(punkSaleValue);

		if (bid !== true && sale !== true) {
			return (
				<div className="PunkDetails">
					<div className="PunkDetailItem">
						<span className="PunkDetailItemTitle">Number</span>
						<span className="PunkDetailItemContent">{idx}</span>
					</div>
					<div className="PunkDetailItem">
						<span className="PunkDetailItemTitle">Value</span>
						<span className="PunkDetailItemContent">
							{punkValue + ' xDai'}
						</span>
					</div>
				</div>
			);
		} else {
			if (bid === true && sale !== true) {
				return (
					<div className="PunkDetails">
						<div className="PunkDetailItem">
							<span className="PunkDetailItemTitle">Number</span>
							<span className="PunkDetailItemContent">{idx}</span>
						</div>
						<div className="PunkDetailItem">
							<span className="PunkDetailItemTitle">Value</span>
							<span className="PunkDetailItemContent">
								{punkValue + ' xDai'}
							</span>
						</div>
						<div className="PunkDetailItem">
							<span className="PunkDetailItemTitle">
								Has bid of
							</span>
							<span className="PunkDetailItemContent">
								{punkBidValue + ' xDai'}
							</span>
						</div>
					</div>
				);
			}

			if (bid !== true && sale === true) {
				return (
					<div className="PunkDetails">
						<div className="PunkDetailItem">
							<span className="PunkDetailItemTitle">Number</span>
							<span className="PunkDetailItemContent">{idx}</span>
						</div>
						<div className="PunkDetailItem">
							<span className="PunkDetailItemTitle">Value</span>
							<span className="PunkDetailItemContent">
								{punkValue + ' xDai'}
							</span>
						</div>
						<div className="PunkDetailItem">
							<span className="PunkDetailItemTitle">
								Is offered for
							</span>
							<span className="PunkDetailItemContent">
								{punkSaleValue + ' xDai'}
							</span>
						</div>
					</div>
				);
			}

			if (bid === true && sale === true) {
				return (
					<div className="PunkDetails">
						<div className="PunkDetailItem">
							<span className="PunkDetailItemTitle">Number</span>
							<span className="PunkDetailItemContent">{idx}</span>
						</div>
						<div className="PunkDetailItem">
							<span className="PunkDetailItemTitle">Value</span>
							<span className="PunkDetailItemContent">
								{punkValue + ' xDai'}
							</span>
						</div>
						<div className="PunkDetailItem">
							<span className="PunkDetailItemTitle">
								Has bid of
							</span>
							<span className="PunkDetailItemContent">
								{punkBidValue + ' xDai'}
							</span>
						</div>
						<div className="PunkDetailItem">
							<span className="PunkDetailItemTitle">
								Is offered for
							</span>
							<span className="PunkDetailItemContent">
								{punkSaleValue + ' xDai'}
							</span>
						</div>
					</div>
				);
			}
		}
	}

	punkButtonComponent() {
		let owned;
		let isBidding;
		let punkBidValue;
		let punkSaleValue;

		const vm = this;

		const owner = vm.punkDetails.owner;

		const idx = vm.punkDetails.idx;
		const bid = vm.punkDetails.bid;
		const sale = vm.punkDetails.sale;
		const bidData = vm.punkDetails.bidData;
		const saleData = vm.punkDetails.saleData;

		if (userService.userSignedIn === true) {
			if (owner.toLowerCase() === userService.address.toLowerCase()) {
				owned = true;
			}
		}

		console.log('Owned', owned);

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
							<div className="PunkDetailButtonContainer">
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
		const attributes = props.attributes;

		console.log(attributes);
		return (
			<div className="PunkDetailItemAttributes">
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
	}

	render() {
		let punkImageUrl;
		let transitionClass;

		const vm = this;

		const PunkDataComponent = vm.punkDataComponent;
		const PunkButtonComponent = vm.punkButtonComponent;

		console.log(vm.punkId);
		console.log(vm.punkDetails);

		punkImageUrl = '/static/media/punks/' + vm.punkId + '.png';

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
					<div className="PunkContainer">
						<div className="PunkItem">
							<img
								alt={''}
								className={'PunkImageDetail'}
								src={punkImageUrl}
							/>
						</div>
					</div>
					<PunkDataComponent />
					<PunkButtonComponent />
				</div>
				<Footer />
			</div>
		);
	}
}

export default Punk;
