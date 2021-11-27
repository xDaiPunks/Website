/* eslint-disable no-unused-vars */
/* eslint-disable no-new-func */
/* eslint-disable array-callback-return */
import React, { PureComponent } from 'react';
import { BigNumber } from 'bignumber.js';

import InfiniteScroll from 'react-infinite-scroll-component';

import Input from 'src/app/com/input/Input';
import Button from 'src/app/com/button/Button';

import ViewService from 'src/app/services/ViewService';
import PunkService from 'src/app/services/PunkService';
import EventService from 'src/app/services/EventService';
import RouteService from 'src/app/services/RouteService';
import UtilityService from 'src/app/services/UtilityService';
import TransitionService from 'src/app/services/TransitionService';

const viewService = new ViewService();
const punkService = new PunkService();
const eventService = new EventService();
const routeService = new RouteService();
const utilityService = new UtilityService();
const transitionService = new TransitionService();

class MarketPlace extends PureComponent {
	constructor(props) {
		super(props);

		this.raf = null;

		this.searchData = null;

		this.searchTimeout = null;

		this.data = punkService.punkData;

		this.state = {
			filter: {
				types: null,
				statuses: null,
				attributes: null,
			},
			sort: null,
			items: null,
		};

		this.componentName = 'MarketPlace';

		this.guid = utilityService.guid();

		this.sortOrder = React.createRef();
		this.searchInput = React.createRef();
		this.searchFilter = React.createRef();

		this.getData = this.getData.bind(this);
		this.showFilter = this.showFilter.bind(this);

		this.getSortFilter = this.getSortFilter.bind(this);

		this.searchChange = this.searchChange.bind(this);
		this.toggleOverlay = this.toggleOverlay.bind(this);

		this.setSearchFilter = this.setSearchFilter.bind(this);
		this.changeSortOrder = this.changeSortOrder.bind(this);

		this.listComponent = this.listComponent.bind(this);

		this.setSortFilter();
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

		eventService.on('change:punkData', vm.guid, (eventData) => {
			if (eventData.type !== 'publicSale') {
				vm.setSortFilter(true);
			}
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

			a.value = parseFloat(a.value);
			b.value = parseFloat(b.value);

			a.rank = parseInt(a.rank, 10);
			b.rank = parseInt(b.rank, 10);

			a.bidValue = 0;
			if (a.bidData.value) {
				a.bidValue = parseFloat(a.bidData.value);
			}

			b.bidValue = 0;
			if (b.bidData.value) {
				b.bidValue = parseFloat(b.bidData.value);
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

	getData() {
		const vm = this;

		const state = utilityService.cloneObject(vm.state);
		const count = state.items.length;

		state.items = state.items.concat(
			vm.searchData.slice(count, count + 60)
		);

		vm.setState(state);
	}

	evaluate(condition) {
		return Function(`return ${condition}`)();
	}

	toggleOverlay(idx) {
		const element = document.getElementById('Overlay' + idx);

		if (!element.style.display) {
			element.style.display = 'flex';
		} else {
			element.style.removeProperty('display');
		}
	}

	showFilter() {
		const vm = this;
		const filter = utilityService.cloneObject(vm.state.filter);

		eventService.dispatchObjectEvent('show:searchFilter', {
			filter: filter,
			setSearchFilter: vm.setSearchFilter,
		});
	}

	getSortFilter() {
		const vm = this;
		const sort = utilityService.getParameterByName('sort');
		const statuses = utilityService.getParameterByName('statuses');
		const attributes = utilityService.getParameterByName('attributes');

		return {
			sort,
			statuses,
			attributes,
		};
	}

	setSortFilter(updateState) {
		let key;

		let i;
		let iCount;

		let filterData;

		let attributeArray;
		let attributesItem;
		let attributesCount;

		let allAttributes;
		let filterAttributes;

		const vm = this;

		const state = utilityService.cloneObject(vm.state);

		const sort = utilityService.getParameterByName('sort');
		const statuses = utilityService.getParameterByName('statuses');
		const attributes = utilityService.getParameterByName('attributes');

		switch (sort) {
			default:
				state.sort = ['-value', '-saleValue', 'idx'];
				break;

			case '-rank':
				state.sort = ['-rank', 'status', 'idx'];
				break;

			case 'rank':
				state.sort = ['rank', 'status', 'idx'];
				break;

			case '-value':
				state.sort = ['-value', '-saleValue', 'idx'];
				break;

			case 'value':
				state.sort = ['value', 'saleValue', 'idx'];
				break;

			case '-bidValue':
				state.sort = ['-bidValue', '-saleValue', 'idx'];
				break;

			case 'bidValue':
				state.sort = ['bidValue', 'saleValue', 'idx'];
				break;

			case '-saleValue':
				state.sort = ['-saleValue', '-value', 'idx'];
				break;

			case 'saleValue':
				state.sort = ['saleValue', 'value', 'idx'];
				break;
		}

		switch (statuses) {
			default:
				state.filter.statuses = null;
				break;

			case 'bids':
				state.filter.statuses = {
					bids: true,
				};
				break;

			case 'offered':
				state.filter.statuses = {
					offered: true,
				};
				break;

			case 'bids,offered':
				state.filter.statuses = {
					bids: true,
					offered: true,
				};
				break;
		}

		if (attributes) {
			attributeArray = attributes.split(',');
			if (attributeArray.length === 0) {
				state.filter.attributes = null;
			} else {
				state.filter.attributes = {};

				for (i = 0, iCount = attributeArray.length; i < iCount; i++) {
					state.filter.attributes[attributeArray[i]] = true;
				}
			}
		}

		filterData = vm.data;

		if (state.filter) {
			if (state.filter.statuses) {
				if (
					state.filter.statuses.hasOwnProperty('bids') ||
					state.filter.statuses.hasOwnProperty('offered')
				) {
					filterData = filterData.filter((item, index) => {
						if (item) {
							if (
								item.bid === true &&
								state.filter.statuses.hasOwnProperty('bids')
							) {
								return item;
							}

							if (
								item.sale === true &&
								state.filter.statuses.hasOwnProperty('offered')
							) {
								return item;
							}
						}
					});
				}
			}

			if (state.filter.attributes) {
				attributesCount = Object.keys(state.filter.attributes).length;
				if (attributesCount > 0) {
					filterData = filterData.filter((item, index) => {
						if (item) {
							attributesItem = item.attributes;
							filterAttributes = state.filter.attributes;

							allAttributes = true;
							for (key in filterAttributes) {
								if (attributesItem.includes(key) !== true) {
									allAttributes = false;
								}
							}

							if (allAttributes === true) {
								return item;
							}
						}
					});
				}
			}
		}

		vm.searchData = vm.sortArray(
			state.sort[0],
			state.sort[1],
			state.sort[2],

			filterData
		);

		state.items = vm.searchData.slice(0, 60);

		if (updateState !== true) {
			vm.state = state;
		} else {
			vm.setState(state);
			vm.forceUpdate();
		}
	}

	searchChange(event) {
		let url;
		let value;
		let searchData;

		const vm = this;
		const state = utilityService.cloneObject(vm.state);

		if (validateInput() !== true) {
			vm.searchData = vm.sortArray(
				state.sort[0],
				state.sort[1],
				state.sort[2],
				punkService.punkData
			);
			state.items = vm.searchData.slice(0, 60);
			vm.setState(state);
		} else {
			value = parseInt(vm.searchInput.current.state.value.trim())
				.toString()
				.toLowerCase();

			clearTimeout(vm.searchTimeout);
			vm.searchTimeout = setTimeout(() => {
				if (vm.raf) {
					cancelAnimationFrame(vm.raf);
				}

				vm.raf = requestAnimationFrame(async () => {
					searchData = vm.data.filter((item, index) => {
						if (item) {
							if (
								item.idx &&
								item.idx.toString().toLowerCase() === value
							) {
								return item;
							}
						}
					});

					url = '/marketplace';
					window.history.pushState({ page: url }, '', '');

					state.filter = {
						statuses: null,
						attributes: null,
					};

					vm.searchData = searchData;
					state.items = vm.searchData.slice(0, 60);

					vm.setState(state);
				});
			}, 100);
		}

		function validateInput() {
			let value;

			if (
				vm.searchInput.current &&
				vm.searchInput.current.state &&
				vm.searchInput.current.state.value &&
				vm.searchInput.current.state.value.trim() !== ''
			) {
				value = parseInt(vm.searchInput.current.state.value.trim());

				if (isNaN(value) !== true) {
					if (value <= 10000) {
						return true;
					}
				}
			}
		}
	}

	setSearchFilter(searchFilter) {
		let key;

		let url;

		let sort;
		let statuses;
		let attributes;

		let statusArray;
		let attributeArray;

		const vm = this;
		const sortFilter = vm.getSortFilter();

		sort = sortFilter.sort;
		statuses = sortFilter.statuses;
		attributes = sortFilter.attributes;

		url = '/marketplace';

		if (!sort) {
			url += '?';
		} else {
			url += '?sort=';
			url += sort;
		}

		statusArray = [];

		if (Object.keys(searchFilter.statuses).length > 0) {
			if (searchFilter.statuses.hasOwnProperty('bids')) {
				statusArray.push('bids');
			}

			if (searchFilter.statuses.hasOwnProperty('offered')) {
				statusArray.push('offered');
			}
		}

		attributeArray = [];

		if (Object.keys(searchFilter.attributes).length > 0) {
			for (key in searchFilter.attributes) {
				attributeArray.push(key);
			}
		}

		if (statusArray.length > 0) {
			if (!sort) {
				url += 'statuses=' + statusArray.join(',');
			} else {
				url += '&statuses=' + statusArray.join(',');
			}
		}

		if (attributeArray.length > 0) {
			if (!sort) {
				if (statusArray.length === 0) {
					url += 'attributes=' + attributeArray.join(',');
				} else {
					url += '&attributes=' + attributeArray.join(',');
				}
			} else {
				url += '&attributes=' + attributeArray.join(',');
			}
		}

		routeService.navigateRoute(url);
	}

	changeSortOrder(event) {
		let url;

		let sort;
		let statuses;
		let attributes;

		const vm = this;

		const sortFilter = vm.getSortFilter();

		const order = vm.sortOrder.current.state.value;
		const state = utilityService.cloneObject(vm.state);

		sort = sortFilter.sort;
		statuses = sortFilter.statuses;
		attributes = sortFilter.attributes;

		url = '/marketplace';

		switch (order) {
			default:
				url += '';

				if (statuses) {
					url += '?statuses=' + statuses;
				}

				if (attributes) {
					if (!statuses) {
						url += '?attributes=' + attributes;
					} else {
						url += '&attributes=' + attributes;
					}
				}

				routeService.navigateRoute(url);
				break;

			case '-rank':
				url += '?sort=-rank';
				if (statuses) {
					url += '&statuses=' + statuses;
				}
				if (attributes) {
					url += '&attributes=' + attributes;
				}
				routeService.navigateRoute(url);
				break;

			case 'rank':
				url += '?sort=rank';
				if (statuses) {
					url += '&statuses=' + statuses;
				}
				if (attributes) {
					url += '&attributes=' + attributes;
				}
				routeService.navigateRoute(url);
				break;

			case '-value':
				url += '?sort=-value';
				if (statuses) {
					url += '&statuses=' + statuses;
				}
				if (attributes) {
					url += '&attributes=' + attributes;
				}
				routeService.navigateRoute(url);
				break;

			case 'value':
				url += '?sort=value';
				if (statuses) {
					url += '&statuses=' + statuses;
				}
				if (attributes) {
					url += '&attributes=' + attributes;
				}
				routeService.navigateRoute(url);
				break;

			case '-bidValue':
				url += '?sort=-bidValue';
				if (statuses) {
					url += '&statuses=' + statuses;
				}
				if (attributes) {
					url += '&attributes=' + attributes;
				}
				routeService.navigateRoute(url);

				break;

			case 'bidValue':
				url += '?sort=bidValue';
				if (statuses) {
					url += '&statuses=' + statuses;
				}
				if (attributes) {
					url += '&attributes=' + attributes;
				}
				routeService.navigateRoute(url);
				break;

			case '-saleValue':
				url += '?sort=-saleValue';
				if (statuses) {
					url += '&statuses=' + statuses;
				}
				if (attributes) {
					url += '&attributes=' + attributes;
				}
				routeService.navigateRoute(url);

				break;

			case 'saleValue':
				url += '?sort=saleValue';
				if (statuses) {
					url += '&statuses=' + statuses;
				}
				if (attributes) {
					url += '&attributes=' + attributes;
				}
				routeService.navigateRoute(url);
				break;
		}
	}

	listComponent() {
		const vm = this;

		const next = vm.getData;
		const dataLength = vm.state.items.length;

		const Punks = punks;

		return (
			<InfiniteScroll
				dataLength={dataLength}
				next={next}
				hasMore={true}
				scrollableTarget={'AppRoot'}
				loader={<div className="PunkGridLoader"></div>}>
				<Punks items={vm.state.items} />
			</InfiniteScroll>
		);

		function punks(props) {
			let rowCount;
			const items = props.items;
			const PunkItems = punkItems;

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

		function punkItems(props) {
			let i;

			let rank;
			let number;
			let status;

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

							imageUrl = '/punks3d/' + items[item].idx + '_mask.png';

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
											BigNumber(
												items[item].saleData.minValue
											)
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
											BigNumber(
												items[item].saleData.minValue
											)
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
		let options;
		let sortValue;
		let transitionClass;

		const vm = this;
		const sortFilter = vm.getSortFilter();

		const ListComponent = vm.listComponent;

		options = [
			{ label: 'Last sale ↓', value: '-value' },
			{ label: 'Last sale ↑', value: 'value' },
			{ label: 'Bid ↓', value: '-bidValue' },
			{ label: 'Bid ↑', value: 'bidValue' },
			{ label: 'Rank ↓', value: 'rank' },
			{ label: 'Rank ↑', value: '-rank' },
			{ label: 'Offered for ↓', value: '-saleValue' },
			{ label: 'Offered for ↑', value: 'saleValue' },
		];

		if (this.props.animationType === 'overlay') {
			transitionClass = 'Overlay';
		}

		if (this.props.animationType === 'underlay') {
			transitionClass = 'Underlay';
		}

		if (!sortFilter.sort) {
			sortValue = '-value';
		} else {
			sortValue = sortFilter.sort;
		}

		return (
			<div
				className={
					this.componentName + ' View ' + transitionClass + ' Load'
				}>
				<div className="ViewBox">
					<div className="Spacer"></div>
					<div className="Controls">
						<div className="ControlsContainer">
							<div className="SearchControl">
								<Input
									ref={vm.searchInput}
									id={'inputSearch'}
									type={'text'}
									inputType={'inputSearch'}
									placeholder={'Number'}
									onChange={vm.searchChange}
								/>
							</div>
							<div className="ControlSpacer" />
							<div className="FilterControl">
								<Input
									ref={vm.sortOrder}
									id={'sort'}
									inputType={'select'}
									options={options}
									defaultValue={sortValue}
									selectedOption={sortValue}
									onChange={(event) => {
										vm.changeSortOrder(event);
									}}
								/>
								<Button
									type={'actionButtonIcon'}
									label={'Filter'}
									title={'Filter'}
									onClick={(event) => {
										event.preventDefault();
										vm.showFilter();
									}}
									iconImage="/static/media/images/icon-filter-white.svg"
									cssClass={'ActionButtonFilter'}
								/>
							</div>
						</div>
					</div>
					<ListComponent />
				</div>
			</div>
		);
	}
}

export default MarketPlace;
