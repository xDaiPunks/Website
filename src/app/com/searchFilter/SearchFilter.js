/* eslint-disable no-unused-expressions */

import { attributes } from 'src/app/data/filters';

import React, { PureComponent } from 'react';

import Input from 'src/app/com/input/Input';

import Animate from 'src/app/services/Animate';

import AppService from 'src/app/services/AppService';
import Web3Service from 'src/app/services/Web3Service';
import EventService from 'src/app/services/EventService';
import ConfigService from 'src/app/services/ConfigService';
import HistoryService from 'src/app/services/HistoryService';
import UtilityService from 'src/app/services/UtilityService';
import TranslationService from 'src/app/services/TranslationService';

const animate = new Animate();

const appService = new AppService();
const web3Service = new Web3Service();
const eventService = new EventService();
const configService = new ConfigService();
const historyService = new HistoryService();
const utilityService = new UtilityService();
const translationService = new TranslationService();

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
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		let animationPromise;

		const vm = this;

		$('.SearchFilter')[0].scrollTop;

		if (vm.state.action === 'showSearchFilter') {
			$('.SearchFilter ').removeClass('Hidden');
		}

		if (vm.state.action === 'hideSearchFilter') {
			//$('.SearchFilter .SearchFilterBackground').addClass('Hidden');

			animationPromise = animate.transitionAddClass(
				$('.SearchFilter'),
				'Hidden'
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

	showSearchFilter(filter) {
		const vm = this;

		vm.setState({
			animate: true,
			action: 'showSearchFilter',
		});
	}

	hideSearchFilter(props) {
		const vm = this;

		vm.setState({
			animate: true,
			action: 'hideSearchFilter',
		});
	}

	closeSearchFilter(event) {
		event.preventDefault();

		this.hideSearchFilter({
			animate: true,
		});
	}

	attributeComponent() {
		const vm = this;

		return (
			<>
				<span className="AttributeTitle">Filter on attribute</span>
				<div className="AttributeComponent">
					{Object.keys(attributes).map((keyName, i) => (
						<label className="CheckBox" key={i}>
							<span className="Label">
								{attributes[keyName].title}
							</span>
							<input
								type="checkbox"
								className="Input"
								data-filter="attributes"
								data-value={attributes[keyName].title}
							/>
							<span className="Checkmark" />
						</label>
					))}
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
			searchFilterClass = 'SearchFilter Animate';
		}

		if (!vm.state.action) {
			return null;
		} else {
			return (
				<div className={searchFilterClass}>
					<div className="SearchFilterSpacer" />
					<div className="SearchFilterContent">
						<AttributeComponent />
					</div>
				</div>
			);
		}
	}
}

export default SearchFilter;
