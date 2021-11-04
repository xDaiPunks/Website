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

class Home extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};

		this.componentName = 'Home';

		this.guid = utilityService.guid();

		this.data = punkService.punkData;

		this.punks = this.punks.bind(this);
		this.punkItems = this.punkItems.bind(this);

		this.saleComponent = this.saleComponent.bind(this);
		this.floorComponent = this.floorComponent.bind(this);
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

			introStartElement[0].style.minHeight = innerHeight + 'px';
		}
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

			a.value = parseFloat(a.value);
			b.value = parseFloat(b.value);

			a.rank = parseInt(a.rank, 10);
			b.rank = parseInt(b.rank, 10);

			a.extraValue = 0;
			if (a.bidData.value) {
				a.extraValue = parseFloat(a.bidData.value);
			}

			b.extraValue = 0;
			if (b.bidData.value) {
				b.extraValue = parseFloat(b.bidData.value);
			}

			a.saleValue = 0;
			if (a.saleData.minValue) {
				a.saleValue = parseFloat(a.saleData.minValue);
			}

			b.saleValue = 0;
			if (b.saleData.minValue) {
				b.saleValue = parseFloat(b.saleData.minValue);
			}

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

	punks(props) {
		let rowCount;

		const vm = this;
		const type = props.type;
		const items = props.items;
		const PunkItems = vm.punkItems;

		return (
			<div className="PunkGrid">
				{items.map((item, index) => {
					rowCount = index % 3;
					if (rowCount === 0) {
						return (
							<div className="PunkRow" key={'row' + index}>
								<PunkItems
									type={type}
									items={items}
									rowIndex={index}
								/>
							</div>
						);
					}
				})}
			</div>
		);
	}

	punkItems(props) {
		let i;

		let rank;
		let number;

		let punkValue;

		let imageUrl;

		let offeredContent;
		let bidContent;

		const rowArray = [];

		const items = props.items;
		const itemsCount = props.items.length;

		const rowIndex = props.rowIndex;

		for (i = 0; i < 3; i++) {
			if (rowIndex + i < itemsCount) {
				rowArray.push(i + rowIndex);
			}
		}

		return (
			<>
				{rowArray.map((item, index) => {
					if (items[item]) {
						rank = items[item].rank;
						number = items[item].idx;

						punkValue = BigNumber(items[item].value)
							.div(1e18)
							.toFormat(2);

						imageUrl = '/punks/' + items[item].idx + '.png';

						bidContent = 'No bids';
						offeredContent = 'Not offered by owner';

						if (items[item].mint === true) {
							if (
								items[item].bid !== true &&
								items[item].sale !== true
							) {
								bidContent = 'No bids';
								offeredContent = 'Not offered by owner';
							} else {
								if (
									items[item].bid === true &&
									items[item].sale !== true
								) {
									bidContent =
										BigNumber(items[item].bidData.value)
											.div(1e18)
											.toFormat(2) + ' xDai';

									offeredContent = 'Not offered by owner';
								}

								if (
									items[item].bid !== true &&
									items[item].sale === true
								) {
									bidContent = 'No bids';
									offeredContent =
										BigNumber(items[item].saleData.minValue)
											.div(1e18)
											.toFormat(2) + ' xDai';
								}

								if (
									items[item].bid === true &&
									items[item].sale === true
								) {
									bidContent =
										BigNumber(items[item].bidData.value)
											.div(1e18)
											.toFormat(2) + ' xDai';

									offeredContent =
										BigNumber(items[item].saleData.minValue)
											.div(1e18)
											.toFormat(2) + ' xDai';
								}
							}
						}

						return (
							<React.Fragment key={'item' + item}>
								<a
									href={'/punk/' + items[item].idx}
									className="PunkItem"
									onClick={(event) => {
										event.preventDefault();
										event.stopPropagation();

										routeService.navigateRoute(
											'/punk/' + items[item].idx
										);
									}}>
									<div className="PunkItemContent">
										<div className="OverlayData">
											<div className="PunkItemDetails Left">
												<span className="DetailsTextTitle">
													Number
												</span>
												<span className="DetailsTextContent Bold">
													{'#' + number}
												</span>
											</div>

											<div className="PunkItemDetails Right">
												<span className="DetailsTextTitle">
													Rank
												</span>
												<span className="DetailsTextContent Bold">
													{rank}
												</span>
											</div>
										</div>
										<div className="PunkImageContainer">
											<img
												alt={''}
												className={'PunkImageGrid'}
												src={imageUrl}
											/>
										</div>

										<div className="PunkDetailsContainer">
											<div className="PunkItemTop">
												<div className="PunkItemDetails">
													<span className="DetailsTextTitle">
														Bid
													</span>
													<span className="DetailsTextContent Bold">
														{bidContent}
													</span>
												</div>
											</div>

											<div className="PunkItemDetails">
												<span className="DetailsTextTitle">
													Last sale
												</span>
												<span className="DetailsTextContent Bold">
													{punkValue + ' xDai'}
												</span>
											</div>

											<div className="PunkItemDetails">
												<span className="DetailsTextTitle">
													Offered for
												</span>
												<span className="DetailsTextContent Bold">
													{offeredContent}
												</span>
											</div>
										</div>
									</div>
								</a>
							</React.Fragment>
						);
					}
				})}
			</>
		);
	}

	saleComponent() {
		let data;
		let Punks;

		const vm = this;

		data = vm.sortArray(
			'-value',
			'rank',
			'idx',

			vm.data
		);

		data = data.slice(0, 6);

		Punks = vm.punks;

		return (
			<div className="ContentBlock Items">
				<div className="BlockTitle">Highest sale</div>
				<Punks type={'owned'} items={data} />
			</div>
		);
	}

	floorComponent() {
		let data;

		let Punks;

		const vm = this;

		data = vm.data.filter((item, index) => {
			if (item) {
				if (item.sale === true) {
					return item;
				}
			}
		});

		data = vm.sortArray(
			'saleValue',
			'value',
			'idx',

			data
		);

		data = data.slice(0, 6);

		Punks = vm.punks;

		return (
			<div className="ContentBlock Items">
				<div className="BlockTitle">Current floor price</div>
				<Punks type={'owned'} items={data} />
			</div>
		);
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
		const SaleComponent = vm.saleComponent;
		const FloorComponent = vm.floorComponent;

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
						<div className="IntroStart"></div>
						<div className="IntroContent">
							<SaleComponent />
							<FloorComponent />
						</div>
						<Footer />
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
