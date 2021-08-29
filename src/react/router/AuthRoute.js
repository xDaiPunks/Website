/* eslint react/no-deprecated :0 */
import React, { Component } from 'react';

import invariant from 'invariant';
import PropTypes from 'prop-types';

import matchPath from './matchPath';

import { Redirect } from 'src/react/router/WebRouter';

import UserService from 'src/app/services/UserService';

const userService = new UserService();

/**
 * The public API for matching a single path and rendering.
 */
class Route extends Component {
	static propTypes = {
		computedMatch: PropTypes.object, // private, from <Switch>
		path: PropTypes.string,
		exact: PropTypes.bool,
		strict: PropTypes.bool,
		sensitive: PropTypes.bool,
		component: PropTypes.func,
		render: PropTypes.func,
		children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
		location: PropTypes.object,
	};

	static contextTypes = {
		router: PropTypes.shape({
			history: PropTypes.object.isRequired,
			route: PropTypes.object.isRequired,
			staticContext: PropTypes.object,
		}),
	};

	static childContextTypes = {
		router: PropTypes.object.isRequired,
	};

	getChildContext() {
		return {
			router: {
				...this.context.router,
				route: {
					location:
						this.props.location ||
						this.context.router.route.location,
					match: this.state.match,
				},
			},
		};
	}

	state = {
		match: this.computeMatch(this.props, this.context.router),
	};

	computeMatch(
		{ computedMatch, location, path, strict, exact, sensitive },
		router
	) {
		if (computedMatch) return computedMatch; // <Switch> already computed the match for us

		invariant(
			router,
			'You should not use <Route> or withRouter() outside a <Router>'
		);

		const { route } = router;
		const pathname = (location || route.location).pathname;

		if (!path) {
			return route.match;
		} else {
			return matchPath(pathname, { path, strict, exact, sensitive });
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
		this.setState({
			match: this.computeMatch(nextProps, nextContext.router),
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		/* Do not enable
		 * Transitions, Switches etc cause rerendering
		 */
		return false;
	}

	render() {
		let to;
		let type;
		let props;
		let location;
		let redirect;
		let animationType;

		let authPath;
		let authBasePath;

		let Component;

		const { match } = this.state;
		const { history, route, staticContext } = this.context.router;

		if (!match) {
			return null;
		}

		type = this.props.type;
		redirect = this.props.redirect;
		animationType = this.props.animationType;

		location = this.props.location || route.location;

		authPath = this.props.routeConfig.home.path;
		authBasePath = this.props.routeConfig.home.path;

		props = { match, location, history, animationType, staticContext };

		Component = this.props.component;

		if (type === 'public') {
			if (redirect !== 'auth') {
				return <Component {...props} />;
			} else {
				if (!userService.userSignedIn) {
					return <Component {...props} />;
				} else {
					to = {
						state: {
							from: props.location,
						},
						pathname: authBasePath,
					};
					return <Redirect to={to} />;
				}
			}
		}

		if (type === 'private') {
			if (userService.userSignedIn) {
				return <Component {...props} />;
			} else {
				to = {
					state: {
						from: props.location,
					},
					pathname: authPath,
				};

				// routeService.setStorageSignInRedirect(location);

				return <Redirect to={to} />;
			}
		}

		if (type === 'notfound') {
			if (!this.props.useRedirect) {
				return <Component {...props} />;
			}

			if (this.props.useRedirect) {
				if (!this.props.useAuthentication) {
					to = {
						pathname: this.props.foundRedirect,
					};
					return <Redirect to={to} />;
				} else {
					if (!userService.userSignedIn) {
						to = {
							pathname: this.props.foundRedirect,
						};
						return <Redirect to={to} />;
					} else {
						to = {
							pathname: this.props.foundAuthRedirect,
						};
						return <Redirect to={to} />;
					}
				}
			}
		}
	}
}

export default Route;
