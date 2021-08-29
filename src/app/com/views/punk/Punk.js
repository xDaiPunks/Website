import React, { PureComponent } from 'react';

import { BigNumber } from 'bignumber.js';

import Header from 'src/app/com/header/Header';
import Footer from 'src/app/com/footer/Footer';

import PunkService from 'src/app/services/PunkService';
import UserService from 'src/app/services/UserService';
import ViewService from 'src/app/services/ViewService';
import EventService from 'src/app/services/EventService';
import ScrollService from 'src/app/services/ScrollService';
import UtilityService from 'src/app/services/UtilityService';
import TransitionService from 'src/app/services/TransitionService';
import TranslationService from 'src/app/services/TranslationService';

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

		this.punkDataComponent = this.punkDataComponent.bind(this);
		this.punkButtonComponent = this.punkButtonComponent.bind(this);

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
				<>
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
				</>
			);
		} else {
			if (bid === true && sale !== true) {
				return (
					<>
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
					</>
				);
			}

			if (bid !== true && sale === true) {
				return (
					<>
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
					</>
				);
			}

			if (bid === true && sale === true) {
				return (
					<>
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
					</>
				);
			}
		}
	}

	punkButtonComponent() {
		const vm = this;
		return null;
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
