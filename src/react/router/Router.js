/* eslint react/no-deprecated :0 */
import React, { Component } from 'react';

import PropTypes from 'prop-types';

/**
 * The public API for putting history on context.
 */
class Router extends Component {
	static propTypes = {
		history: PropTypes.object.isRequired,
		children: PropTypes.node,
	};

	static contextTypes = {
		router: PropTypes.object,
	};

	static childContextTypes = {
		router: PropTypes.object.isRequired,
	};

	getChildContext() {
		return {
			router: {
				...this.context.router,
				history: this.props.history,
				route: {
					location: this.props.history.location,
					match: this.state.match,
				},
			},
		};
	}

	state = {
		match: this.computeMatch(this.props.history.location.pathname),
	};

	computeMatch(pathname) {
		return {
			path: '/',
			url: '/',
			params: {},
			isExact: pathname === '/',
		};
	}

	UNSAFE_componentWillMount() {
		const { history } = this.props;

		// Do this here so we can setState when a <Redirect> changes the
		// location in componentWillMount. This happens e.g. when doing
		// server rendering using a <StaticRouter>.
		this.unlisten = history.listen(() => {
			this.setState({
				match: this.computeMatch(history.location.pathname),
			});
		});
	}

	componentWillUnmount() {
		this.unlisten();
	}

	render() {
		const { children } = this.props;
		if (!children) {
			return null;
		} else {
			return React.Children.only(children);
		}
	}
}

export default Router;
