import PropTypes from 'prop-types';

export function transitionTimeout(transitionType) {
	let timeoutPropName = 'transition' + transitionType + 'Timeout';
	let enabledPropName = 'transition' + transitionType;

	return props => {
		// If the transition is enabled
		if (props[enabledPropName]) {
			// If no timeout duration is provided
			if (props[timeoutPropName] == null) {
				return new Error(timeoutPropName);

				// If the duration isn't a number
			} else if (typeof props[timeoutPropName] !== 'number') {
				return new Error(timeoutPropName + ' must be a number (in milliseconds)');
			}
		}

		return null;
	};
}

export const timeoutsShape = PropTypes.oneOfType([
	PropTypes.number,
	PropTypes.shape({
		enter: PropTypes.number,
		exit: PropTypes.number
	}).isRequired
]);

export const classNamesShape = PropTypes.oneOfType([
	PropTypes.string,
	PropTypes.shape({
		enter: PropTypes.string,
		exit: PropTypes.string,
		active: PropTypes.string
	}),
	PropTypes.shape({
		enter: PropTypes.string,
		enterActive: PropTypes.string,
		exit: PropTypes.string,
		exitActive: PropTypes.string
	})
]);
