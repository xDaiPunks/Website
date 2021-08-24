import React, { Component } from 'react';

import { Router, Route } from 'src/react/router/WebRouter';

import Modal from 'src/app/com/modal/Modal';
import Navigation from 'src/app/com/navigation/Navigation';

import AppService from 'src/app/services/AppService';
import ViewService from 'src/app/services/ViewService';
import EventService from 'src/app/services/EventService';
import RouteService from 'src/app/services/RouteService';
import UtilityService from 'src/app/services/UtilityService';
import HistoryService from 'src/app/services/HistoryService';

const appService = new AppService();
const viewService = new ViewService();
const eventService = new EventService();
const routeService = new RouteService();
const utilityService = new UtilityService();
const historyService = new HistoryService();

routeService.setRouteConfig();

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.guid = utilityService.guid();

		eventService.on('set:view', this.guid, (view) => {
			this.setDocumentTitle(utilityService.lowerCaseFirst(view));
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState !== this.state) {
			return true;
		} else {
			return false;
		}
	}

	componentDidMount() {
		const vm = this;
		const promiseArray = [];

		viewService.setViewSpacing();

		promiseArray.push(appService.getInitData());
		promiseArray.push(appService.checkLanguageConfig());

		Promise.all(promiseArray)
			.then((responses) => {
				vm.initComplete();
			})
			.catch((responsesError) => {
				vm.initComplete();
			});
	}

	initComplete() {
		const vm = this;

		vm.setState({
			status: 'initialized',
		});

		eventService.dispatchObjectEvent('hide:preloader', true);
	}

	setDocumentTitle(view) {
		switch (view) {
			default:
				document.title = 'xDaiPunks';
				break;
		}
	}

	componentWillUnmount() {
		const vm = this;
		eventService.off('set:view', vm.guid);
	}

	render() {
		if (!this.state.status) {
			return null;
		}

		if (this.state.status === 'error') {
			return null;
		}

		if (this.state.status === 'initialized') {
			return (
				<div className="App">
					<Modal />
					<Navigation />
					<Router history={historyService.history}>
						<Route render={routeService.application} />
					</Router>
				</div>
			);
		}
	}
}

export default App;
