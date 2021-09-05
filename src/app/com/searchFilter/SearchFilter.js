/* eslint-disable no-unused-expressions */

import { attributes } from 'src/app/data/filters';

import React, { PureComponent } from 'react';

import Animate from 'src/app/services/Animate';

import EventService from 'src/app/services/EventService';
import HistoryService from 'src/app/services/HistoryService';
import UtilityService from 'src/app/services/UtilityService';

const animate = new Animate();

const eventService = new EventService();
const historyService = new HistoryService();
const utilityService = new UtilityService();

class SearchFilter extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			action: null,
			animate: null,
		};

		this.stateProps = {};

		this.guid = utilityService.guid();

		this.buyInput = React.createRef();

		this.filterEvent = this.filterEvent.bind(this);

		this.showSearchFilter = this.showSearchFilter.bind(this);
		this.hideSearchFilter = this.hideSearchFilter.bind(this);
		this.closeSearchFilter = this.closeSearchFilter.bind(this);

		this.stateFilter = this.stateFilter.bind(this);
		this.attributeFilter = this.attributeFilter.bind(this);

		this.setEventListeners = this.setEventListeners.bind(this);
		this.setAttributeFilter = this.setAttributeFilter.bind(this);

		this.attributeComponent = this.attributeComponent.bind(this);
	}

	componentDidMount() {
		let animate;

		const vm = this;

		vm.historyListener = historyService.history.listen(
			({ action, location }) => {
				vm.setState({
					animate: null,
					action: null,
				});
			}
		);

		eventService.on('hide:searchFilter', vm.guid, (props) => {
			if (!props.animate) {
				animate = true;
			} else {
				animate = props.animate;
			}

			vm.hideSearchFilter({
				animate: animate,
				type: props.type,
			});
		});

		eventService.on('show:searchFilter', vm.guid, (props) => {
			let key;
			let propsObject = {};

			for (key in props) {
				propsObject[key] = props[key];
			}

			if (!props.animate) {
				propsObject.animate = true;
			} else {
				propsObject.animate = props.animate;
			}

			vm.showSearchFilter(propsObject);
		});
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		let filterElement;
		let animationPromise;

		const vm = this;

		filterElement = $('.SearchFilter');
		if (filterElement.length > 0) {
			$('.SearchFilter')[0].scrollTop;
		}

		if (vm.state.action === 'showSearchFilter') {
			$('.SearchFilter ').addClass('Animate');

			vm.setEventListeners();
		}

		if (vm.state.action === 'hideSearchFilter') {
			//$('.SearchFilter .SearchFilterBackground').addClass('Hidden');

			animationPromise = animate.transitionRemoveClass(
				$('.SearchFilter'),
				'Animate'
			);

			animationPromise.fail((error) => {
				vm.setState({
					animate: null,
					action: null,
				});
			});

			animationPromise.then((response) => {
				if (response.result === 'success') {
					vm.setState({
						animate: null,
						action: null,
					});
				}
			});
		}
	}

	showSearchFilter(props) {
		const vm = this;

		vm.stateProps = props;

		vm.setState({
			animate: props.animate,
			action: 'showSearchFilter',
		});
	}

	hideSearchFilter(props) {
		const vm = this;

		vm.setState({
			animate: props.animate,
			action: 'hideSearchFilter',
		});
	}

	closeSearchFilter(event) {
		event.preventDefault();

		this.hideSearchFilter({
			animate: true,
		});
	}

	setEventListeners() {
		let i;
		let iCount;

		const vm = this;
		const attributeCheckboxes = document.querySelectorAll(
			'.AttributeComponent [type="checkbox"]'
		);

		for (i = 0, iCount = attributeCheckboxes.length; i < iCount; i++) {
			attributeCheckboxes[i].removeEventListener('click', vm.filterEvent);
			attributeCheckboxes[i].addEventListener('click', vm.filterEvent);
		}
	}

	filterEvent(event) {
		const vm = this;

		vm.setAttributeFilter({
			checked: event.target.checked,
			value: event.target.dataset.value,
		});
	}

	stateFilter() {
		let state = {};
		const vm = this;

		if (vm.stateProps) {
			if (vm.stateProps.filter) {
				if (vm.stateProps.filter.hasOwnProperty('state')) {
					state = vm.stateProps.filter.state || {};
				}
			}
		}
		return state;
	}

	attributeFilter() {
		let attributes = {};
		const vm = this;

		if (vm.stateProps) {
			if (vm.stateProps.filter) {
				if (vm.stateProps.filter.hasOwnProperty('attributes')) {
					attributes = vm.stateProps.filter.attributes || {};
				}
			}
		}
		return attributes;
	}

	setStateFilter(state) {}

	setAttributeFilter(attribute) {
		let state;
		let attributes;

		const vm = this;

		if (vm.stateProps) {
			if (vm.stateProps.filter) {
				state = vm.stateFilter();
				attributes = vm.attributeFilter();

				vm.stateProps.filter.state = state;
				vm.stateProps.filter.attributes = attributes;

				if (attribute.checked === true) {
					vm.stateProps.filter.attributes[attribute.value] = true;
				} else {
					delete vm.stateProps.filter.attributes[attribute.value];
				}
			}

			if (vm.stateProps.setSearchFilter) {
				vm.hideSearchFilter({ animate: true });
				vm.stateProps.setSearchFilter(vm.stateProps.filter);
			}
		}
	}

	attributeComponent() {
		let checked;

		const vm = this;
		const attributeFilter = vm.attributeFilter();

		return (
			<>
				<span className="AttributeTitle">Attributes</span>
				<div className="AttributeComponent">
					{Object.keys(attributes).map((keyName, i) => {
						if (
							attributeFilter.hasOwnProperty(
								attributes[keyName].title
							)
						) {
							checked = true;
						} else {
							checked = false;
						}

						return (
							<label className="CheckBox" key={i}>
								<span className="Label">
									{attributes[keyName].title}
								</span>
								<input
									type="checkbox"
									className="Input"
									defaultChecked={checked}
									data-filter="attributes"
									data-value={attributes[keyName].title}
								/>
								<span className="Checkmark" />
							</label>
						);
					})}
				</div>
			</>
		);
	}

	componentWillUnmount() {
		const vm = this;
		vm.historyListener();
	}

	render() {
		let onClick;
		let searchFilterClass;

		const vm = this;

		onClick = vm.closeSearchFilter;

		const AttributeComponent = vm.attributeComponent;

		if (vm.state.animate !== true) {
			searchFilterClass = 'SearchFilter';
		} else {
			searchFilterClass = 'SearchFilter';
		}

		if (!vm.state.action) {
			return null;
		} else {
			return (
				<div className={searchFilterClass}>
					<div className="SearchFilterHeader">
						<div className="SearchFilterHeaderCountainer">
							<span className="SearchFilterHeaderTxt">
								Filter
							</span>
							<button
								className="CloseSearchFilterButton"
								onClick={onClick}>
								<div className="Cross">
									<div className="CloseCrossLine Left"></div>
									<div className="CloseCrossLine Right"></div>
								</div>
							</button>
						</div>
					</div>
					<div className="SearchFilterContent">
						<AttributeComponent />
					</div>
				</div>
			);
		}
	}
}

export default SearchFilter;
