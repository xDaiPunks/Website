/* eslint-disable no-unused-expressions */

import { statuses, attributes } from 'src/app/data/filters';

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

		this.showSearchFilter = this.showSearchFilter.bind(this);
		this.hideSearchFilter = this.hideSearchFilter.bind(this);
		this.closeSearchFilter = this.closeSearchFilter.bind(this);

		this.statusFilter = this.statusFilter.bind(this);
		this.attributeFilter = this.attributeFilter.bind(this);

		this.setEventListeners = this.setEventListeners.bind(this);

		this.setStatusFilter = this.setStatusFilter.bind(this);
		this.setAttributeFilter = this.setAttributeFilter.bind(this);

		this.filterEventStatus = this.filterEventStatus.bind(this);
		this.filterEventAttribute = this.filterEventAttribute.bind(this);

		this.statusComponent = this.statusComponent.bind(this);
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

		const statusCheckboxes = document.querySelectorAll(
			'.StatusComponent [type="checkbox"]'
		);

		const attributeCheckboxes = document.querySelectorAll(
			'.AttributeComponent [type="checkbox"]'
		);

		for (i = 0, iCount = statusCheckboxes.length; i < iCount; i++) {
			statusCheckboxes[i].removeEventListener(
				'click',
				vm.filterEventStatus
			);
			statusCheckboxes[i].addEventListener('click', vm.filterEventStatus);
		}

		for (i = 0, iCount = attributeCheckboxes.length; i < iCount; i++) {
			attributeCheckboxes[i].removeEventListener(
				'click',
				vm.filterEventAttribute
			);
			attributeCheckboxes[i].addEventListener(
				'click',
				vm.filterEventAttribute
			);
		}
	}

	filterEventStatus(event) {
		const vm = this;

		vm.setStatusFilter({
			checked: event.target.checked,
			value: event.target.dataset.value,
		});
	}

	filterEventAttribute(event) {
		const vm = this;

		vm.setAttributeFilter({
			checked: event.target.checked,
			value: event.target.dataset.value,
		});
	}

	statusFilter() {
		let statuses = {};
		const vm = this;

		if (vm.stateProps) {
			if (vm.stateProps.filter) {
				if (vm.stateProps.filter.hasOwnProperty('statuses')) {
					statuses = vm.stateProps.filter.statuses || {};
				}
			}
		}

		return statuses;
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

	setStatusFilter(status) {
		let statuses;
		let attributes;

		const vm = this;

		if (vm.stateProps) {
			if (vm.stateProps.filter) {
				statuses = vm.statusFilter();
				attributes = vm.attributeFilter();

				vm.stateProps.filter.statuses = statuses;
				vm.stateProps.filter.attributes = attributes;

				if (status.checked === true) {
					vm.stateProps.filter.statuses[status.value] = true;
				} else {
					delete vm.stateProps.filter.statuses[status.value];
				}
			}

			if (vm.stateProps.setSearchFilter) {
				vm.hideSearchFilter({ animate: true });
				vm.stateProps.setSearchFilter(vm.stateProps.filter);
			}
		}
	}

	setAttributeFilter(attribute) {
		let statuses;
		let attributes;

		const vm = this;

		if (vm.stateProps) {
			if (vm.stateProps.filter) {
				statuses = vm.statusFilter();
				attributes = vm.attributeFilter();

				vm.stateProps.filter.statuses = statuses;
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

	statusComponent() {
		let checked;

		const vm = this;
		const statusFilter = vm.statusFilter();

		return (
			<>
				<span className="StatusTitle">Status</span>
				<div className="StatusComponent">
					{Object.keys(statuses).map((keyName, i) => {
						if (
							statusFilter.hasOwnProperty(statuses[keyName].value)
						) {
							checked = true;
						} else {
							checked = false;
						}

						return (
							<label className="CheckBox" key={i}>
								<span className="Label">
									{statuses[keyName].title}
								</span>
								<input
									type="checkbox"
									className="Input"
									defaultChecked={checked}
									data-filter="attributes"
									data-value={statuses[keyName].value}
								/>
								<span className="Checkmark" />
							</label>
						);
					})}
				</div>
			</>
		);
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

		const StatusComponent = vm.statusComponent;
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
						<StatusComponent />
						<AttributeComponent />
					</div>
				</div>
			);
		}
	}
}

export default SearchFilter;
