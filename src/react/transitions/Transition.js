/* eslint multiline-ternary:off */
/* eslint react/no-deprecated :0 */
import * as PropTypes from 'prop-types';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { timeoutsShape } from './utils/PropTypes';

export const ENTERING = 'entering';
export const ENTERED = 'entered';
export const EXITING = 'exiting';
export const EXITED = 'exited';
export const UNMOUNTED = 'unmounted';

/**
 * The Transition component lets you describe a transition from one component
 * state to another _over time_ with a simple declarative API. Most commonly
 * it's used to animate the mounting and unmounting of a component, but can also
 * be used to describe in-place transition states as well.
 *
 * By default the `Transition` component does not alter the behavior of the
 * component it renders, it only tracks "enter" and "exit" states for the components.
 * It's up to you to give meaning and effect to those states. For example we can
 * add styles to a component when it enters or exits:
 *
 * ```jsx
 * import Transition from 'react-transition-group/Transition';
 *
 * const duration = 300;
 *
 * const defaultStyle = {
 *   transition: `opacity ${duration}ms ease-in-out`,
 *   opacity: 0,
 * }
 *
 * const transitionStyles = {
 *   entering: { opacity: 0 },
 *   entered:  { opacity: 1 },
 * };
 *
 * const Fade = ({ in: inProp }) => (
 *   <Transition in={inProp} timeout={duration}>
 *     {(state) => (
 *       <div style={{
 *         ...defaultStyle,
 *         ...transitionStyles[state]
 *       }}>
 *         I'm A fade Transition!
 *       </div>
 *     )}
 *   </Transition>
 * );
 * ```
 *
 * As noted the `Transition` component doesn't _do_ anything by itself to its child component.
 * What it does do is track transition states over time so you can update the
 * component (such as by adding styles or classes) when it changes states.
 *
 * There are 4 main states a Transition can be in:
 *  - `ENTERING`
 *  - `ENTERED`
 *  - `EXITING`
 *  - `EXITED`
 *
 * Transition state is toggled via the `in` prop. When `true` the component begins the
 * "Enter" stage. During this stage, the component will shift from its current transition state,
 * to `'entering'` for the duration of the transition and then to the `'entered'` stage once
 * it's complete. Let's take the following example:
 *
 * ```jsx
 * state= { in: false };
 *
 * toggleEnterState = () => {
 *   this.setState({ in: true });
 * }
 *
 * render() {
 *   return (
 *     <div>
 *       <Transition in={this.state.in} timeout={500} />
 *       <button onClick={this.toggleEnterState}>Click to Enter</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * When the button is clicked the component will shift to the `'entering'` state and
 * stay there for 500ms (the value of `timeout`) when finally switches to `'entered'`.
 *
 * When `in` is `false` the same thing happens except the state moves from `'exiting'` to `'exited'`.
 *
 * ### Example
 *
 * <iframe src="https://codesandbox.io/embed/y26rj99yov?autoresize=1&fontsize=12&hidenavigation=1&moduleview=1" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
 *
 */

class Transition extends Component {
	static contextTypes = {
		transitionGroup: PropTypes.object,
	};
	static childContextTypes = {
		transitionGroup: () => {},
	};

	constructor(props, context) {
		super(props, context);

		let parentGroup = context.transitionGroup;
		// In the context of a TransitionGroup all enters are really appears
		let appear =
			parentGroup && !parentGroup.isMounting ? props.enter : props.appear;

		let initialStatus;

		this.nextStatus = null;
		this.nextCallback = null;

		if (props.in) {
			if (appear) {
				initialStatus = EXITED;
				this.nextStatus = ENTERING;
			} else {
				initialStatus = ENTERED;
			}
		} else {
			if (props.unmountOnExit || props.mountOnEnter) {
				initialStatus = UNMOUNTED;
			} else {
				initialStatus = EXITED;
			}
		}

		this.timeoutArray = [];

		this.state = { status: initialStatus };
	}

	getChildContext() {
		return { transitionGroup: null }; // allows for nested Transitions
	}

	cancelNextCallback() {
		if (this.nextCallback !== null) {
			this.nextCallback.cancel();
			this.nextCallback = null;
		}
	}

	safeSetState(nextState, callback) {
		this.pendingState = nextState;
		callback = this.setNextCallback(callback);

		this.setState(nextState, () => {
			this.pendingState = null;
			callback();
		});
	}

	setNextCallback(callback) {
		let active = true;

		this.nextCallback = event => {
			if (active) {
				active = false;
				this.nextCallback = null;

				callback(event);
			}
		};

		this.nextCallback.cancel = () => {
			active = false;
		};

		return this.nextCallback;
	}

	getTimeouts() {
		const { timeout } = this.props;
		let exit, enter, appear;

		exit = enter = appear = timeout;

		if (timeout != null && typeof timeout !== 'number') {
			exit = timeout.exit;
			enter = timeout.enter;
			appear = timeout.appear;
		}
		return { exit, enter, appear };
	}

	transitionCalll(node, timeout, handler) {
		this.setNextCallback(handler);

		if (node) {
			if (this.props.addEndListener) {
				this.props.addEndListener(node, this.nextCallback);
			}

			/* this timout is a fallback */
			if (timeout != null) {
				this.timeoutArray.push({
					node: node,
					timeout: window.setTimeout(this.nextCallback, timeout),
				});
			}
		} else {
			window.setTimeout(this.nextCallback, 0);
		}
	}

	changeReceiveProps(nextProps) {
		const { status } = this.pendingState || this.state;

		if (nextProps.in) {
			if (status === UNMOUNTED) {
				this.setState({ status: EXITED });
			}
			if (status !== ENTERING && status !== ENTERED) {
				this.nextStatus = ENTERING;
			}
		} else {
			if (status === ENTERING || status === ENTERED) {
				this.nextStatus = EXITING;
			}
		}
	}

	updateStatus(mounting = false) {
		let nextStatus = this.nextStatus;

		if (nextStatus !== null) {
			this.nextStatus = null;
			// nextStatus will always be ENTERING or EXITING.
			this.cancelNextCallback();
			const node = ReactDOM.findDOMNode(this);

			if (nextStatus === ENTERING) {
				this.performEnter(node, mounting);
			} else {
				this.performExit(node);
			}
		} else if (this.props.unmountOnExit && this.state.status === EXITED) {
			this.setState({ status: UNMOUNTED });
		}
	}

	performExit(node) {
		const { exit } = this.props;
		const timeouts = this.getTimeouts();

		// no exit animation skip right to EXITED
		if (!exit) {
			this.safeSetState({ status: EXITED }, () => {
				this.clearTimeout(node);
				this.props.onExited(node);
			});
			return;
		}

		this.props.onExit(node);

		this.safeSetState({ status: EXITING }, () => {
			this.props.onExiting(node);

			this.transitionCalll(node, timeouts.exit, () => {
				this.safeSetState({ status: EXITED }, () => {
					this.clearTimeout(node);
					this.props.onExited(node);
				});
			});
		});
	}

	performEnter(node, mounting) {
		let appearing;

		const { enter } = this.props;
		const timeouts = this.getTimeouts();

		if (!this.context.transitionGroup) {
			appearing = mounting;
		} else {
			appearing = this.context.transitionGroup.isMounting;
		}

		// no enter animation skip right to ENTERED
		// if we are mounting and running this it means appear _must_ be set
		if (!mounting && !enter) {
			this.safeSetState({ status: ENTERED }, () => {
				this.clearTimeout(node);
				this.props.onEntered(node);
			});
			return;
		}

		this.props.onEnter(node, appearing);

		this.safeSetState({ status: ENTERING }, () => {
			this.props.onEntering(node, appearing);

			this.transitionCalll(node, timeouts.enter, () => {
				this.safeSetState({ status: ENTERED }, () => {
					this.clearTimeout(node);
					this.props.onEntered(node, appearing);
				});
			});
		});
	}

	clearTimeout(node) {
		let i;
		let arrayCount;

		for (i = 0, arrayCount = this.timeoutArray.length; i < arrayCount; i++) {
			if (node === this.timeoutArray[i].node) {
				clearTimeout(this.timeoutArray[i].timeout);

				delete this.timeoutArray[i].node;
				delete this.timeoutArray[i].timeout;

				this.timeoutArray.splice(i, 1);
				break;
			}
		}
	}

	componentDidMount() {
		this.updateStatus(true);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		this.changeReceiveProps(nextProps);
	}

	componentDidUpdate() {
		this.updateStatus();
	}

	componentWillUnmount() {
		this.cancelNextCallback();
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (
			(nextState.status === 'entering' && this.props.in === true) ||
			(nextState.status === 'exited' && this.state.status !== 'exiting') ||
			(nextState.status === 'entered' && this.state.status !== 'entering')
		) {
			return true;
		} else {
			return false;
		}
	}

	render() {
		const status = this.state.status;
		if (status === UNMOUNTED) {
			return null;
		}

		const { children, ...childProps } = this.props;
		// filter props for Transtition
		delete childProps.in;
		delete childProps.mountOnEnter;
		delete childProps.unmountOnExit;
		delete childProps.appear;
		delete childProps.enter;
		delete childProps.exit;
		delete childProps.timeout;
		delete childProps.addEndListener;
		delete childProps.onEnter;
		delete childProps.onEntering;
		delete childProps.onEntered;
		delete childProps.onExit;
		delete childProps.onExiting;
		delete childProps.onExited;

		if (typeof children === 'function') {
			return children(status, childProps);
		}

		const child = React.Children.only(children);
		return React.cloneElement(child, childProps);
	}
}

Transition.propTypes = {
	/**
	 * A `function` child can be used instead of a React element.
	 * This function is called with the current transition status
	 * ('entering', 'entered', 'exiting', 'exited', 'unmounted'), which can used
	 * to apply context specific props to a component.
	 *
	 * ```jsx
	 * <Transition timeout={150}>
	 *   {(status) => (
	 *     <MyComponent className={`fade fade-${status}`} />
	 *   )}
	 * </Transition>
	 * ```
	 */
	children: PropTypes.oneOfType([
		PropTypes.func.isRequired,
		PropTypes.element.isRequired,
	]).isRequired,

	/**
	 * Show the component; triggers the enter or exit states
	 */
	in: PropTypes.bool,

	/**
	 * By default the child component is mounted immediately along with
	 * the parent `Transition` component. If you want to "lazy mount" the component on the
	 * first `in={true}` you can set `mountOnEnter`. After the first enter transition the component will stay
	 * mounted, even on "exited", unless you also specify `unmountOnExit`.
	 */
	mountOnEnter: PropTypes.bool,

	/**
	 * By default the child component stays mounted after it reaches the `'exited'` state.
	 * Set `unmountOnExit` if you'd prefer to unmount the component after it finishes exiting.
	 */
	unmountOnExit: PropTypes.bool,

	/**
	 * Normally a component is not transitioned if it is shown when the `<Transition>` component mounts.
	 * If you want to transition on the first mount set `appear` to `true`, and the
	 * component will transition in as soon as the `<Transition>` mounts.
	 *
	 * > Note: there are no specific "appear" states. `appear` only adds an additional `enter` transition.
	 */
	appear: PropTypes.bool,

	/**
	 * Enable or disable enter transitions.
	 */
	enter: PropTypes.bool,

	/**
	 * Enable or disable exit transitions.
	 */
	exit: PropTypes.bool,

	/**
	 * The duration of the transition, in milliseconds.
	 * Required unless `addEventListener` is provided
	 *
	 * You may specify a single timeout for all transitions like: `timeout={500}`,
	 * or individually like:
	 *
	 * ```jsx
	 * timeout={{
	 *  enter: 450,
	 *  exit: 450,
	 * }}
	 * ```
	 *
	 * @type {number | { enter?: number, exit?: number }}
	 */
	timeout: (props, ...args) => {
		let pt = timeoutsShape;

		if (!props.addEndListener) {
			pt = pt.isRequired;
		}

		return pt(props, ...args);
	},

	/**
	 * Add a custom transition end trigger. Called with the transitioning
	 * DOM node and a `done` callback. Allows for more fine grained transition end
	 * logic. **Note:** Timeouts are still used as a fallback if provided.
	 *
	 * ```jsx
	 * addEndListener={(node, done) => {
	 *   // use the css transitionend event to mark the finish of a transition
	 *   node.addEventListener('transitionend', done, false);
	 * }}
	 * ```
	 */
	addEndListener: PropTypes.func,

	/**
	 * Callback fired before the "entering" status is applied. An extra parameter
	 * `isAppearing` is supplied to indicate if the enter stage is occurring on the initial mount
	 *
	 * @type Function(node: HtmlElement, isAppearing: bool) -> void
	 */
	onEnter: PropTypes.func,

	/**
	 * Callback fired after the "entering" status is applied. An extra parameter
	 * `isAppearing` is supplied to indicate if the enter stage is occurring on the initial mount
	 *
	 * @type Function(node: HtmlElement, isAppearing: bool)
	 */
	onEntering: PropTypes.func,

	/**
	 * Callback fired after the "entered" status is applied. An extra parameter
	 * `isAppearing` is supplied to indicate if the enter stage is occurring on the initial mount
	 *
	 * @type Function(node: HtmlElement, isAppearing: bool) -> void
	 */
	onEntered: PropTypes.func,

	/**
	 * Callback fired before the "exiting" status is applied.
	 *
	 * @type Function(node: HtmlElement) -> void
	 */
	onExit: PropTypes.func,

	/**
	 * Callback fired after the "exiting" status is applied.
	 *
	 * @type Function(node: HtmlElement) -> void
	 */
	onExiting: PropTypes.func,

	/**
	 * Callback fired after the "exited" status is applied.
	 *
	 * @type Function(node: HtmlElement) -> void
	 */
	onExited: PropTypes.func,
};

// Name the function so it is clearer in the documentation
function noop() {}

Transition.defaultProps = {
	in: false,
	mountOnEnter: false,
	unmountOnExit: false,
	appear: false,
	enter: true,
	exit: true,

	onEnter: noop,
	onEntering: noop,
	onEntered: noop,

	onExit: noop,
	onExiting: noop,
	onExited: noop,
};

Transition.UNMOUNTED = 0;
Transition.EXITED = 1;
Transition.ENTERING = 2;
Transition.ENTERED = 3;
Transition.EXITING = 4;

export default Transition;
