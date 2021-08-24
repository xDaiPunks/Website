/* eslint react/no-deprecated :0 */
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import matchPath from './matchPath';

import UtilityService from 'src/app/services/UtilityService';

const utilityService = new UtilityService();

/**
 * The public API for rendering the first <Route> that matches.
 */
class Switch extends Component {
	static contextTypes = {
		router: PropTypes.shape({
			route: PropTypes.object.isRequired,
		}).isRequired,
	};

	static propTypes = {
		children: PropTypes.node,
		location: PropTypes.object,
	};

	constructor(props) {
		super(props);

		this.location = null;
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(utilityService.objectIsEqual(this.location, nextProps.location)) {
			return false;
		} else {
			return true;
		}
	}

	render() {
		let child;
		let match;

		const { route } = this.context.router;

		const { children } = this.props;

		const location = this.props.location || route.location;

		React.Children.forEach(children, element => {
			if (match == null && React.isValidElement(element)) {
				const {
					exact,
					strict,
					sensitive,
					from,
					path: pathProp,
				} = element.props;

				const path = pathProp || from;

				child = element;

				if (!path) {
					match = route.match;
				} else {
					match = matchPath(location.pathname, {
						path,
						exact,
						strict,
						sensitive,
					});
				}
			}
		});
		
		if (!match) {
			return null;
		} else {
			this.location = location;
			return React.cloneElement(child, { location, computedMatch: match });
		}
	}
}

export default Switch;
