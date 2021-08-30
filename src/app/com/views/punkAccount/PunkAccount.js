import React, { PureComponent } from 'react';
import { BigNumber } from 'bignumber.js';

import Footer from 'src/app/com/footer/Footer';
import Loader from 'src/app/com/loader/Loader';
import Button from 'src/app/com/button/Button';

import AppService from 'src/app/services/AppService';
import ViewService from 'src/app/services/ViewService';
import UserService from 'src/app/services/UserService';
import PunkService from 'src/app/services/PunkService';
import EventService from 'src/app/services/EventService';
import ScrollService from 'src/app/services/ScrollService';
import RouteService from 'src/app/services/RouteService';
import UtilityService from 'src/app/services/UtilityService';
import TransitionService from 'src/app/services/TransitionService';
import TranslationService from 'src/app/services/TranslationService';

const appService = new AppService();
const viewService = new ViewService();
const userService = new UserService();
const punkService = new PunkService();
const eventService = new EventService();
const routeService = new RouteService();
const utilityService = new UtilityService();
const transitionService = new TransitionService();
const translationService = new TranslationService();

class PunkAccount extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
		};

		this.loader = React.createRef();

		this.componentName = 'PunkAccount';

		this.guid = utilityService.guid();

		this.getData = this.getData.bind(this);
		this.withdraw = this.withdraw.bind(this);

		this.punks = this.punks.bind(this);
		this.punkItems = this.punkItems.bind(this);

		this.bidComponent = this.bidComponent.bind(this);
		this.punkComponent = this.punkComponent.bind(this);
	}

	updateView() {
		viewService.setViewSpacing();
		viewService.updateScrollWidth();
	}

	componentDidMount() {
		const vm = this;
		const pageElement = $('.' + vm.componentName + '.View');

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

		vm.updateView();

		eventService.dispatchObjectEvent('set:view', this.componentName);
		transitionService.updateTransition(this.props, this.componentName);

		vm.getData();
	}

	getData() {
		const vm = this;

		if (userService.userSignedIn !== true) {
			routeService.navigateRoute('/');
		} else {
			punkService.setPunkDetails();
			appService
				.pendingWithdrawals(userService.address)
				.then((response) => {
					console.log(response);
					userService.withdrawAmount = response;

					vm.setState({ loading: false }, () => {
						vm.loader.current.hideLoader(true);
					});
				})
				.catch((responseError) => {
					console.log(responseError);
				});
		}
	}

	withdraw() {
		appService
			.withdraw()
			.then((response) => {
				console.log(response);
			})
			.catch((responseError) => {
				console.log(responseError);
			});
	}

	punks(props) {
		let rowCount;

		const vm = this;
		const items = props.items;
		const PunkItems = vm.punkItems;

		return (
			<div className="PunkGrid">
				{items.map((item, index) => {
					rowCount = index % 3;
					if (rowCount === 0) {
						return (
							<div className="PunkRow" key={'row' + index}>
								<PunkItems items={items} rowIndex={index} />
							</div>
						);
					}
				})}
			</div>
		);
	}

	punkItems(props) {
		let i;

		let number;
		let status;

		let punkValue;

		let imageUrl;

		let rowCount;

		let attributes;

		let spacerClassL;
		let spacerClassR;

		const vm = this;
		const rowArray = [];

		const items = props.items;
		const itemsCount = props.items.length;

		const rowIndex = props.rowIndex;

		for (i = 0; i < 3; i++) {
			if (rowIndex + i < itemsCount) {
				rowArray.push(i + rowIndex);
			}
		}

		rowCount = rowArray.length;

		return (
			<>
				{rowArray.map((item, index) => {
					if (items[item]) {
						number = items[item].idx;

						attributes = items[item].attributes.join(' · ');
						punkValue = BigNumber(items[item].value)
							.div(1e18)
							.toFormat(2);

						imageUrl =
							'/static/media/punks/' + items[item].idx + '.png';

						status = 'Mint';
						if (items[item].mint === true) {
							status = 'Owned';
						}

						if (index === 1) {
							spacerClassL = 'PunkSpacer';
							spacerClassR = 'PunkSpacer';

							if (rowCount === 2) {
								spacerClassL = 'PunkSpacer';
								spacerClassR = 'PunkSpacer Hidden';
							}
						} else {
							spacerClassL = 'PunkSpacer Hidden';
							spacerClassR = 'PunkSpacer Hidden';
						}

						return (
							<React.Fragment key={'item' + item}>
								<div className={spacerClassL}></div>
								<div
									className="PunkItem"
									onClick={(event) => {
										event.preventDefault();

										routeService.navigateRoute(
											'/punk/' + items[item].idx
										);
									}}>
									<div className="PunkItemContent">
										<div className="PunkImageContainer">
											<div className="PunkImageContainerBG">
												<img
													alt={''}
													className={'PunkImageGrid'}
													src={imageUrl}
												/>
											</div>
										</div>
										<div className="PunkDetailesContainer">
											<div className="PunkItemTop">
												<div className="PunkItemDetails">
													<span className="DetailsTextTitle">
														Number
													</span>
													<span className="DetailsTextContent Bold">
														{'#' + number}
													</span>
												</div>
												<div className="PunkItemDetails Right">
													<span className="DetailsTextTitle">
														Status
													</span>
													<span className="DetailsTextContent Bold">
														{status}
													</span>
												</div>
											</div>
											<div className="PunkItemDetails">
												<span className="DetailsTextTitle">
													Value
												</span>
												<span className="DetailsTextContent Bold">
													{punkValue + ' xDai'}
												</span>
											</div>
										</div>
									</div>
								</div>
								<div className={spacerClassR}></div>
							</React.Fragment>
						);
					}
				})}
			</>
		);
	}

	bidComponent() {
		let key;
		let Punks;

		const vm = this;

		const bidArray = [];
		const bids = punkService.bids;

		for (key in bids) {
			bidArray.push(punkService.punkObject[key]);
		}

		console.log(bidArray);

		if (bidArray.length === 0) {
			return null;
		} else {
			Punks = vm.punks;

			return (
				<div className="ContentBlock Items">
					<div className="BlockTitle">My bids</div>
					<Punks items={bidArray} />
				</div>
			);
		}
	}

	punkComponent() {
		let key;
		let Punks;

		const vm = this;

		const ownedArray = [];
		const owned = punkService.owned;

		for (key in owned) {
			ownedArray.push(punkService.punkObject[key]);
		}

		if (ownedArray.length === 0) {
			return null;
		} else {
			Punks = vm.punks;

			return (
				<div className="ContentBlock Items">
					<div className="BlockTitle">My punks</div>
					<Punks items={ownedArray} />
				</div>
			);
		}
	}

	componentWillUnmount() {
		const vm = this;

		eventService.off('resize', vm.guid);
		eventService.off('force:state', vm.guid);
		eventService.off('preloader:hide', vm.guid);
		eventService.off('change:language', vm.guid);
	}

	render() {
		let address;
		let withdrawAmount;

		let transitionClass;

		let BidComponent;
		let PunkComponent;

		const vm = this;

		if (this.props.animationType === 'overlay') {
			transitionClass = 'Overlay';
		}

		if (this.props.animationType === 'underlay') {
			transitionClass = 'Underlay';
		}

		if (this.state.loading === true) {
			return (
				<>
					<div
						className={
							this.componentName +
							' View ' +
							transitionClass +
							' Load'
						}>
						<div className="ViewBox" />
						<Footer />
					</div>
					<Loader ref={vm.loader} />
				</>
			);
		} else {
			address = userService.address;
			withdrawAmount = BigNumber(userService.withdrawAmount)
				.div(1e18)
				.toFixed(2);

			BidComponent = this.bidComponent;
			PunkComponent = this.punkComponent;

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
							<div className="Spacer" />
							<div className="ContentBlock">
								<div className="BlockTitle">My account</div>
								<div className="BlockContent">
									<div className="AccountItem">
										<Button
											type={'actionButton'}
											label={'Disconnect'}
											title={'Disconnect'}
											onClick={(event) => {
												event.preventDefault();
											}}
											cssClass={'ActionButtonAccount'}
										/>
										<div className="AccountItemContent">
											<span className="AccountItemTitleText">
												Connected wallet
											</span>
											<span className="AccountItemContentText">
												{address}
											</span>
										</div>
									</div>
									<div className="AccountItem">
										<Button
											type={'actionButton'}
											label={'Widthdraw'}
											title={'Widthdraw'}
											onClick={(event) => {
												event.preventDefault();
												vm.withdraw();
											}}
											cssClass={'ActionButtonAccount'}
										/>
										<div className="AccountItemContent">
											<span className="AccountItemTitleText">
												Available for withdraw
											</span>
											<span className="AccountItemContentText">
												{withdrawAmount + ' xDai'}
											</span>
										</div>
									</div>
								</div>
							</div>
							<BidComponent />
							<PunkComponent />
						</div>
						<Footer />
					</div>
					<Loader ref={vm.loader} />
				</>
			);
		}
	}
}

export default PunkAccount;
