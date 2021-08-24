/* eslint react/no-deprecated :0 */
import React, { Component } from 'react';

import invariant from 'invariant';
import PropTypes from 'prop-types';

import matchPath from './matchPath';

const isEmptyChildren = children => React.Children.count(children) === 0;

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
					location: this.props.location || this.context.router.route.location,
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

	render() {
		const { match } = this.state;
		const { children, component, render } = this.props;
		const { history, route, staticContext } = this.context.router;
		const location = this.props.location || route.location;
		const props = { match, location, history, staticContext };

		if (component) {
			if (!match) {
				return null;
			} else {
				return React.createElement(component, props);
			}
		}

		if (render) {
			if (!match) {
				return null;
			} else {
				return render(props);
			}
		}

		if (typeof children === 'function') {
			return children(props);
		}

		if (children && !isEmptyChildren(children)) {
			return React.Children.only(children);
		}

		return null;
	}
}

export default Route;
