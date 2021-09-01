/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
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
import RouteService from 'src/app/services/RouteService';
import UtilityService from 'src/app/services/UtilityService';
import TransitionService from 'src/app/services/TransitionService';

const appService = new AppService();
const viewService = new ViewService();
const userService = new UserService();
const punkService = new PunkService();
const eventService = new EventService();
const routeService = new RouteService();
const utilityService = new UtilityService();
const transitionService = new TransitionService();

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
		this.updateState = this.updateState.bind(this);

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

		vm.getData();

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

		eventService.on('change:punkData', vm.guid, (eventData) => {
			punkService.setPunkDetails();

			const bids = punkService.bids;
			const owned = punkService.owned;

			const address = userService.address.toLowerCase();

			if (
				bids.hasOwnProperty(eventData.idx) ||
				owned.hasOwnProperty(eventData.idx)
			) {
				vm.updateState();
			} else {
				if (
					eventData.hasOwnProperty('toAddress') &&
					address === eventData.toAddress.toLowerCase()
				) {
					vm.updateState();
				}

				if (
					eventData.hasOwnProperty('fromAddress') &&
					address === eventData.fromAddress.toLowerCase()
				) {
					vm.updateState();
				}
			}
		});
	}

	updateState() {
		const vm = this;

		punkService.setPunkDetails();

		appService
			.pendingWithdrawals(userService.address)
			.then((response) => {
				userService.withdrawAmount = response;

				vm.setState(vm.state);
				vm.forceUpdate();
			})
			.catch((responseError) => {
				vm.setState(vm.state);
				vm.forceUpdate();
			});
	}

	sortArray(prop1, prop2, prop3, array) {
		let sortOrder1;
		let sortOrder2;
		let sortOrder3;

		sortOrder1 = 1;
		sortOrder2 = 1;
		sortOrder3 = 1;

		if (prop1.substr(0, 1) === '-') {
			sortOrder1 = -1;
			prop1 = prop1.substr(1);
		}

		return array.sort((a, b) => {
			a = utilityService.cloneObject(a);
			b = utilityService.cloneObject(b);

			if (prop1 === 'idx') {
				a[prop1] = parseInt(a.idx, 10);
				b[prop1] = parseInt(b.idx, 10);
			}

			if (prop1 === 'status') {
				if (a.mint !== true) {
					a[prop1] = 4;
				} else {
					if (a.bid !== true && a.sale !== true) {
						a[prop1] = 3;
					} else {
						if (a.bid === true && a.sale !== true) {
							a[prop1] = 2;
						}

						if (a.bid !== true && a.sale === true) {
							a[prop1] = 1;
						}

						if (a.bid === true && a.sale === true) {
							a[prop1] = 0;
						}
					}
				}

				if (b.mint !== true) {
					b[prop1] = 4;
				} else {
					if (b.bid !== true && b.sale !== true) {
						b[prop1] = 3;
					} else {
						if (b.bid === true && b.sale === false) {
							b[prop1] = 2;
						}

						if (b.bid === false && b.sale === true) {
							b[prop1] = 1;
						}

						if (b.bid === true && b.sale === true) {
							b[prop1] = 0;
						}
					}
				}
			}

			if (a[prop1] < b[prop1]) {
				return -1 * sortOrder1;
			} else {
				if (a[prop1] > b[prop1]) {
					return 1 * sortOrder1;
				} else {
					if (prop2.substr(0, 1) === '-') {
						sortOrder2 = -1;
						prop2 = prop2.substr(1);
					}

					if (prop2 === 'idx') {
						a[prop2] = parseInt(a.idx, 10);
						b[prop2] = parseInt(b.idx, 10);
					}

					if (prop2 === 'status') {
						if (a.mint === false) {
							a[prop2] = 4;
						} else {
							if (a.bid === false && a.sale === false) {
								a[prop2] = 3;
							} else {
								if (a.bid === true && a.sale === false) {
									a[prop2] = 2;
								}

								if (a.bid === false && a.sale === true) {
									a[prop2] = 1;
								}

								if (a.bid === true && a.sale === true) {
									a[prop2] = 0;
								}
							}
						}

						if (b.mint === false) {
							b[prop2] = 4;
						} else {
							if (b.bid === false && b.sale === false) {
								b[prop2] = 3;
							} else {
								if (b.bid === true && b.sale === false) {
									b[prop2] = 2;
								}

								if (b.bid === false && b.sale === true) {
									b[prop2] = 1;
								}

								if (b.bid === true && b.sale === true) {
									b[prop2] = 0;
								}
							}
						}
					}

					if (a[prop2] < b[prop2]) {
						return -1 * sortOrder2;
					} else {
						if (a[prop2] > b[prop2]) {
							return 1 * sortOrder2;
						} else {
							if (prop3.substr(0, 1) === '-') {
								sortOrder3 = -1;
								prop3 = prop3.substr(1);
							}

							if (prop3 === 'idx') {
								a[prop3] = parseInt(a.idx, 10);
								b[prop3] = parseInt(b.idx, 10);
							}

							if (prop3 === 'status') {
								if (a.mint === false) {
									a[prop3] = 4;
								} else {
									if (a.bid === false && a.sale === false) {
										a[prop3] = 3;
									} else {
										if (
											a.bid === true &&
											a.sale === false
										) {
											a[prop3] = 2;
										}

										if (
											a.bid === false &&
											a.sale === true
										) {
											a[prop3] = 1;
										}

										if (a.bid === true && a.sale === true) {
											a[prop3] = 0;
										}
									}
								}

								if (b.mint === false) {
									b[prop3] = 4;
								} else {
									if (b.bid === false && b.sale === false) {
										b[prop3] = 3;
									} else {
										if (
											b.bid === true &&
											b.sale === false
										) {
											b[prop3] = 2;
										}

										if (
											b.bid === false &&
											b.sale === true
										) {
											b[prop3] = 1;
										}

										if (b.bid === true && b.sale === true) {
											b[prop3] = 0;
										}
									}
								}
							}

							if (a[prop3] < b[prop3]) {
								return -1 * sortOrder3;
							} else {
								if (a[prop3] > b[prop3]) {
									return 1 * sortOrder3;
								} else {
									return 0;
								}
							}
						}
					}
				}
			}
		});
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
					userService.withdrawAmount = response;

					vm.setState({ loading: false }, () => {
						vm.loader.current.hideLoader(true);
					});
				})
				.catch((responseError) => {});
		}
	}

	withdraw() {
		const vm = this;
		appService
			.withdraw()
			.then((response) => {
				vm.updateState();
			})
			.catch((responseError) => {
				vm.updateState();
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

						imageUrl = '/punks/' + items[item].idx + '.png';

						status = 'Not Minted';
						status = 'Not Minted';

						if (items[item].mint === true) {
							if (
								items[item].bid !== true &&
								items[item].sale !== true
							) {
								status = 'Market';
							} else {
								if (
									items[item].bid === true &&
									items[item].sale !== true
								) {
									status = 'Bid';
								}

								if (
									items[item].bid !== true &&
									items[item].sale === true
								) {
									status = 'Sale';
								}

								if (
									items[item].bid === true &&
									items[item].sale === true
								) {
									status = 'Sale & Bid';
								}
							}
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
		eventService.off('change:punkData', vm.guid);
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
											type={'actionButtonIcon'}
											label={'Disconnect'}
											title={'Disconnect'}
											onClick={(event) => {
												event.preventDefault();
											}}
											iconImage="/static/media/images/icon-disconnect-white.svg"
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
											type={'actionButtonIcon'}
											label={'Widthdraw'}
											title={'Widthdraw'}
											onClick={(event) => {
												event.preventDefault();
												vm.withdraw();
											}}
											iconImage="/static/media/images/icon-money-white.svg"
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
							<div className="SpacerBottom" />
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
