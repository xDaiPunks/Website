/* eslint-disable no-new-func */
/* eslint-disable array-callback-return */
import React, { PureComponent } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { punks } from 'src/app/data/punks';

import Input from 'src/app/com/input/Input';
import Header from 'src/app/com/header/Header';
import Footer from 'src/app/com/footer/Footer';

import ViewService from 'src/app/services/ViewService';
import EventService from 'src/app/services/EventService';
import ScrollService from 'src/app/services/ScrollService';
import UtilityService from 'src/app/services/UtilityService';
import TransitionService from 'src/app/services/TransitionService';
import TranslationService from 'src/app/services/TranslationService';

const viewService = new ViewService();
const eventService = new EventService();
const utilityService = new UtilityService();
const transitionService = new TransitionService();
const translationService = new TranslationService();

const originalData = require('src/app/data/punks');

class MarketPlace extends PureComponent {
	constructor(props) {
		super(props);

		this.raf = null;
		this.searchTimeout = null;

		this.data = punks;
		this.searchData = punks;

		this.state = {
			items: this.searchData.slice(0, 60),
		};

		this.searchInput = React.createRef();

		this.componentName = 'MarketPlace';

		this.guid = utilityService.guid();

		this.getData = this.getData.bind(this);
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

	searchChange(event) {
		let i;
		let iCount;

		let b;
		let batchSize;

		let value;
		let dataCount;
		let searchData;

		const vm = this;

		console.log(vm.searchInput.current.state);

		const data = vm.data;
		const state = utilityService.cloneObject(vm.state);

		if (
			vm.searchInput.current &&
			vm.searchInput.current.state &&
			vm.searchInput.current.state.value &&
			vm.searchInput.current.state.value !== ''
		) {
			value = vm.searchInput.current.state.value.toString().toLowerCase();

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
			}, 5);
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
			let gender;

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

			console.log(rowCount);

			return (
				<>
					{rowArray.map((item, index) => {
						if (items[item]) {
							number = items[item].idx;
							gender = items[item].type;
							attributes = items[item].attributes.join(' - ');

							imageUrl =
								'/static/media/punks/' +
								items[item].idx +
								'.png';

							status = 'To be minted';
							if (items[item].status) {
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
									<div className="PunkItem">
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
														<span className="DetailsTextContent">
															{number}
														</span>
													</div>
													<div className="PunkItemDetails Right">
														<span className="DetailsTextTitle">
															Status
														</span>
														<span className="DetailsTextContent">
															{status}
														</span>
													</div>
												</div>
												<div className="PunkItemDetails">
													<span className="DetailsTextTitle">
														Gender
													</span>
													<span className="DetailsTextContent">
														{gender}
													</span>
												</div>
												<div className="PunkItemDetails">
													<span className="DetailsTextTitle">
														Attributes
													</span>
													<span className="DetailsTextContent">
														&nbsp;
													</span>
													<span className="DetailsTextContentOverFlow">
														{attributes}
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
						<Input
							ref={vm.searchInput}
							id={'inputSearch'}
							type={'text'}
							inputType={'inputSearch'}
							placeholder={'Search by number'}
							onChange={vm.searchChange}
						/>
					</div>
					<ListComponent />
				</div>
			</div>
		);
	}
}

export default MarketPlace;
