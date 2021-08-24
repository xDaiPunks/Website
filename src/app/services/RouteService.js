import React from 'react';
import { scrollTo } from 'scroll-polyfill';

import { AuthRoute, Switch } from 'src/react/router/WebRouter';

import {
	CSSTransition,
	TransitionGroup,
} from 'src/react/transitions/Transitions';

import UserService from 'src/app/services/UserService';
import EventService from 'src/app/services/EventService';
import ScrollService from 'src/app/services/ScrollService';
import UtilityService from 'src/app/services/UtilityService';
import HistoryService from 'src/app/services/HistoryService';

let Instance;

const userService = new UserService();
const eventService = new EventService();
const scrollService = new ScrollService();
const utilityService = new UtilityService();
const historyService = new HistoryService();

class RouteService {
	constructor() {
		if (!Instance) {
			Instance = this;

			Instance.authPath = null;
			Instance.authBasePath = null;

			Instance.routeConfig = null;
			Instance.switchConfig = null;
			Instance.navigationConfig = null;

			Instance.animation = Instance.animation.bind(Instance);
			Instance.application = Instance.application.bind(Instance);

			Instance.signInRoute = Instance.signInRoute.bind(Instance);
			Instance.navigateBack = Instance.navigateBack.bind(Instance);
			Instance.navigateRoute = Instance.navigateRoute.bind(Instance);
			Instance.setRouteConfig = Instance.setRouteConfig.bind(Instance);
			Instance.navigateDomRoute = Instance.navigateDomRoute.bind(
				Instance
			);
			Instance.setStorageSignInRedirect = Instance.setStorageSignInRedirect.bind(
				this
			);
			Instance.generateNavigationObject = Instance.generateNavigationObject.bind(
				this
			);
			Instance.generateApplicationRoutes = Instance.generateApplicationRoutes.bind(
				Instance
			);
		}

		return Instance;
	}

	signInRoute() {
		let routeConfig = this.routeConfig;
		let stateConfig = historyService.history.location.state;

		if (!stateConfig || !stateConfig.from || !stateConfig.from.pathname) {
			this.navigateRoute(routeConfig.start.path);
		} else {
			this.navigateRoute(stateConfig.from.pathname);
		}
	}

	navigateBack() {
		this.navigateRoute('/');
		/*
		if (
			!historyService.history.location.state ||
			!historyService.history.location.state.from
		) {
			this.navigateRoute('/');
		} else {
			historyService.history.goBack();
		}
		*/
	}

	navigateRoute(
		path,
		state,
		forceRefresh = false,
		forceRefreshParameter = null
	) {
		let location;
		let locationString;

		let routePath;
		let selectedRoute;

		let stateObject = state || {};
		let navigationConfig = this.navigationConfig;

		if (!path || path === '') {
			return;
		}

		location = utilityService.generateLocation(path);
		routePath = utilityService.generateRoutePath(location.pathname);

		if (!navigationConfig.hasOwnProperty(routePath)) {
			return;
		} else {
			selectedRoute = navigationConfig[routePath];
		}

		if (!selectedRoute) {
			return;
		}

		scrollTo(window, { top: 0, behavior: 'auto' });
		scrollTo(scrollService.scrollOriginalElement, {
			top: 0,
			behavior: 'auto',
		});

		if (location.pathname === '/') {
			locationString =
				location.pathname + location.search + location.hash;
		} else {
			locationString =
				location.pathname + '/' + location.search + location.hash;
		}

		if (selectedRoute.type === 'public') {
			Object.assign(stateObject, {
				from: {
					pathname: historyService.history.location,
				},
			});

			if (selectedRoute.redirect === 'auth') {
				if (userService.userSignedIn) {
					locationString = navigationConfig['/wallet'].path;
				}
			}
		}

		if (selectedRoute.type === 'private') {
			Object.assign(stateObject, {
				from: {
					pathname: historyService.history.location,
				},
			});

			if (!userService.userSignedIn) {
				Object.assign(stateObject, {
					from: {
						pathname: locationString,
					},
				});

				this.setStorageSignInRedirect({
					pathname: locationString,
				});

				locationString = navigationConfig['/sign-in'].path;
			}
		}

		if (location.pathname !== historyService.history.location.pathname) {
			historyService.history.push(locationString, stateObject);

			if (forceRefresh && forceRefreshParameter) {
				eventService.dispatchObjectEvent(forceRefreshParameter);
			}
		} else {
			if (location.search !== historyService.history.location.search) {
				historyService.history.push(locationString, stateObject);

				if (forceRefresh && forceRefreshParameter) {
					eventService.dispatchObjectEvent(forceRefreshParameter);
				}
			} else {
				if (location.hash !== historyService.history.location.hash) {
					historyService.history.push(locationString, stateObject);

					if (forceRefresh && forceRefreshParameter) {
						eventService.dispatchObjectEvent(forceRefreshParameter);
					}
				}
			}
		}
	}

	navigateDomRoute(event) {
		if (!event || !event.currentTarget) {
			return;
		}

		if (!event.currentTarget.getAttribute('data-route')) {
			return;
		}

		this.navigateRoute(event.currentTarget.getAttribute('data-route'));
	}

	navigateScrollPosition(domElement, scrollType) {
		let position;
		let behavior = scrollType || 'smooth';

		scrollTo(window, { top: 0, behavior: 'auto' });

		position = domElement.offset().top + scrollService.scrollY;

		scrollTo(scrollService.scrollOriginalElement, {
			top: position,
			left: 0,
			behavior: behavior,
		});
	}

	scrollBackToTop(scrollType) {
		let behavior = scrollType || 'smooth';

		scrollTo(window, { top: 0, behavior: 'auto' });

		scrollTo(scrollService.scrollOriginalElement, {
			top: 0,
			left: 0,
			behavior: behavior,
		});
	}

	getParams() {
		
	}

	userSignOut() {
		this.clearStorageSignInRedirect();
	}

	getStorageSignInRedirect() {
		return localStorage.getItem('signInRedirect');
	}

	clearStorageSignInRedirect() {
		localStorage.removeItem('signInRedirect');
	}

	setStorageSignInRedirect(location) {
		let hash = '';
		let search = '';
		let pathname = '';

		if (location.hash && location.hash !== '') {
			hash = location.hash;
		}

		if (location.search && location.search !== '') {
			search = location.search;
		}

		if (location.pathname && location.pathname !== '') {
			pathname = location.pathname;
		}

		if (pathname && pathname !== '') {
			localStorage.setItem('signInRedirect', pathname + search + hash);
		}
	}

	animation({ children, ...props }) {
		let i;
		let arrayCount;

		let childs;
		let routeId;
		let pathname;

		const timeout = 800; // this is a fallback timeout

		const addEndListener = (node, doneCallback) => {
			node.addEventListener(
				utilityService.transitionEndProperty,
				doneCallback,
				false
			);
		};

		childs = children.props.children;
		pathname = children.props.location.pathname;

		for (i = 0, arrayCount = childs.length; i < arrayCount; i++) {
			if (pathname === childs[i].props.path) {
				routeId = childs[i].key;
				break;
			}
		}

		return (
			<CSSTransition
				classNames="Route"
				timeout={timeout}
				routeId={routeId}
				addEndListener={addEndListener}
				{...props}>
				{children}
			</CSSTransition>
		);
	}

	setRouteConfig() {
		let key;
		let config;

		let routeConfig = {};

		config = utilityService.cloneObject(require('src/route-config'));

		for (key in config) {
			if (key === 'notfound') {
				routeConfig[key] = config[key];
			} else {
				routeConfig[key] = config[key];
				routeConfig[key].component = require('src/' +
					config[key].component).default;
			}
		}

		this.routeConfig = routeConfig;
		this.navigationConfig = this.generateNavigationObject(this.routeConfig);
	}

	application({ location, ...props }) {
		const Animation = this.animation;
		const ApplicationRoutes = this.generateApplicationRoutes(
			this.routeConfig
		);

		return (
			<TransitionGroup className="ViewContainer">
				<Animation key={location.key}>
					<Switch location={location}>{ApplicationRoutes}</Switch>
				</Animation>
			</TransitionGroup>
		);
	}

	generateNavigationObject(routeConfig) {
		let routeId;
		let routeIdArray;
		let navigationObject = {};

		for (let key in routeConfig) {
			if (routeConfig[key].path) {
				routeId = routeConfig[key].path;
				if (routeId.indexOf(':') !== -1) {
					routeIdArray = routeId.split(':');

					routeId = routeIdArray[0].substring(
						0,
						routeIdArray[0].length - 1
					);
				}

				navigationObject[routeId] = routeConfig[key];
				navigationObject[routeId].id = key;
			}
		}

		return navigationObject;
	}

	generateApplicationRoutes(routeConfig) {
		if (this.switchConfig) {
			return this.switchConfig;
		} else {
			this.switchConfig = [];

			for (let key in routeConfig) {
				if (key !== 'notfound') {
					this.switchConfig.push(
						<AuthRoute
							key={key}
							exact
							path={routeConfig[key].path}
							routeConfig={routeConfig}
							type={routeConfig[key].type}
							animationType={routeConfig[key].animationType}
							redirect={routeConfig[key].redirect}
							component={routeConfig[key].component}
						/>
					);
				}

				if (key === 'notfound') {
					this.switchConfig.push(
						<AuthRoute
							key={key}
							found={false}
							exact
							path={routeConfig[key].path}
							routeConfig={routeConfig}
							type={routeConfig[key].type}
							animationType={routeConfig[key].animationType}
							useRedirect={routeConfig[key].useRedirect}
							useAuthentication={
								routeConfig[key].useAuthentication
							}
							foundRedirect={routeConfig.home.path}
							foundAuthRedirect={routeConfig.home.path}
						/>
					);
				}
			}

			return this.switchConfig;
		}
	}
}

export default RouteService;
