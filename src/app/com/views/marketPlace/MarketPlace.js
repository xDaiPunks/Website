/* eslint-disable no-unused-vars */
/* eslint-disable no-new-func */
/* eslint-disable array-callback-return */
import React, { PureComponent } from 'react';
import { BigNumber } from 'bignumber.js';

import InfiniteScroll from 'react-infinite-scroll-component';

import Input from 'src/app/com/input/Input';
import Button from 'src/app/com/button/Button';
import SearchFilter from 'src/app/com/searchFilter/SearchFilter';

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
		this.searchTimeout = null;

		this.data = punkService.punkData;

		this.searchData = this.sortArray(
			'status',
			'-value',
			'idx',
			punkService.punkData
		);

		this.state = {
			filter: {},
			sort: ['status', '-value', 'idx'],
			items: this.searchData.slice(0, 60),
		};

		this.componentName = 'MarketPlace';

		this.guid = utilityService.guid();

		this.searchInput = React.createRef();
		this.searchFilter = React.createRef();

		this.getData = this.getData.bind(this);
		this.showFilter = this.showFilter.bind(this);

		this.searchChange = this.searchChange.bind(this);
		this.listComponent = this.listComponent.bind(this);
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
				const state = utilityService.cloneObject(vm.state);

				vm.data = punkService.punkData;

				vm.searchData = vm.sortArray(
					state.sort[0],
					state.sort[1],
					state.sort[2],
					punkService.punkData
				);

				state.items = vm.searchData.slice(0, 60);

				this.setState(state);
				this.forceUpdate();
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

	showFilter() {
		const vm = this;
		vm.searchFilter.current.showSearchFilter(vm.state.searchFilter);
	}

	filterChange() {}

	searchChange(event) {
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
								item.idx
									.toString()
									.toLowerCase()
									.indexOf(value) !== -1
							) {
								return item;
							}
						}
					});

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

			let number;
			let status;

			let punkValue;

			let imageUrl;

			let rowCount;

			let attributes;

			let spacerClassL;
			let spacerClassR;

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
														className={
															'PunkImageGrid'
														}
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
		let transitionClass;

		const vm = this;

		if (this.props.animationType === 'overlay') {
			transitionClass = 'Overlay';
		}

		if (this.props.animationType === 'underlay') {
			transitionClass = 'Underlay';
		}

		const ListComponent = vm.listComponent;

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
									placeholder={'Search by number'}
									onChange={vm.searchChange}
								/>
							</div>
							<div className="ControlSpacer" />
							<div className="FilterControl">
								<Button
									type={'actionButtonIcon'}
									label={'Filter'}
									title={'Filter'}
									onClick={(event) => {
										event.preventDefault();
										vm.showFilter();
									}}
									iconImage="/static/media/images/icon-filter.svg"
									cssClass={'ActionButtonFilter'}
								/>
							</div>
						</div>
					</div>
					<ListComponent />
				</div>
				<SearchFilter ref={vm.searchFilter} animate={true} />
			</div>
		);
	}
}

export default MarketPlace;
