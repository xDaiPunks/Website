/* eslint-disable react/forbid-foreign-prop-types */
import * as PropTypes from 'prop-types';

import React, { Component } from 'react';
import { scrollTo } from 'scroll-polyfill';

import Transition from './Transition';
import { classNamesShape } from './utils/PropTypes';

import EventService from 'src/app/services/EventService';
import ScrollService from 'src/app/services/ScrollService';

const eventService = new EventService();
const scrollService = new ScrollService();

const propTypes = {
	...Transition.propTypes,

	/**
	 * The animation classNames applied to the component as it enters or exits.
	 * A single name can be provided and it will be suffixed for each stage: e.g.
	 *
	 * `classNames="fade"` applies `fade-enter`, `fade-enter-active`,
	 * `fade-exit`, `fade-exit-active`, `fade-appear`, and `fade-appear-active`.
	 * Each individual classNames can also be specified independently like:
	 *
	 * ```js
	 * classNames={{
	 *  appear: 'my-appear',
	 *  appearActive: 'my-active-appear',
	 *  enter: 'my-enter',
	 *  enterActive: 'my-active-enter',
	 *  exit: 'my-exit',
	 *  exitActive: 'my-active-exit',
	 * }}
	 * ```
	 *
	 * @type {string | {
	 *  appear?: string,
	 *  appearActive?: string,
	 *  enter?: string,
	 *  enterActive?: string,
	 *  exit?: string,
	 *  exitActive?: string,
	 * }}
	 */
	classNames: classNamesShape,

	/**
	 * A `<Transition>` callback fired immediately after the 'enter' or 'appear' class is
	 * applied.
	 *
	 * @type Function(node: HtmlElement, isAppearing: bool)
	 */
	onEnter: PropTypes.func,

	/**
	 * A `<Transition>` callback fired immediately after the 'enter-active' or
	 * 'appear-active' class is applied.
	 *
	 * @type Function(node: HtmlElement, isAppearing: bool)
	 */
	onEntering: PropTypes.func,

	/**
	 * A `<Transition>` callback fired immediately after the 'enter' or
	 * 'appear' classes are **removed** from the DOM node.
	 *
	 * @type Function(node: HtmlElement, isAppearing: bool)
	 */
	onEntered: PropTypes.func,

	/**
	 * A `<Transition>` callback fired immediately after the 'exit' class is
	 * applied.
	 *
	 * @type Function(node: HtmlElement)
	 */
	onExit: PropTypes.func,

	/**
	 * A `<Transition>` callback fired immediately after the 'exit-active' is applied.
	 *
	 * @type Function(node: HtmlElement
	 */
	onExiting: PropTypes.func,

	/**
	 * A `<Transition>` callback fired immediately after the 'exit' classes
	 * are **removed** from the DOM node.
	 *
	 * @type Function(node: HtmlElement)
	 */
	onExited: PropTypes.func,
};

/**
 * A `Transition` component using CSS transitions and animations.
 * It's inspired by the excellent [ng-animate](http://www.nganimate.org/) library.
 *
 * `CSSTransition` applies a pair of class names during the `appear`, `enter`,
 * and `exit` stages of the transition. The first class is applied and then a
 * second "active" class in order to activate the css animation.
 *
 * When the `in` prop is toggled to `true` the Component will get
 * the `example-enter` CSS class and the `example-enter-active` CSS class
 * added in the next tick. This is a convention based on the `classNames` prop.
 *
 * <iframe src="https://codesandbox.io/embed/kw8z6pp9zo?autoresize=1&fontsize=12&hidenavigation=1&moduleview=1" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
 */
class CSSTransition extends Component {
	addClass = (node, classes) => {
		if (!node) {
			return;
		}

		return (
			classes && classes.split(' ').forEach((c) => node.classList.add(c))
		);
	};

	removeClass = (node, classes) => {
		if (!node) {
			return;
		}

		return (
			classes &&
			classes.split(' ').forEach((c) => node.classList.remove(c))
		);
	};

	onEnter = (node, appearing) => {
		const { className } = this.getClassNames(
			appearing ? 'appear' : 'enter'
		);

		this.removeClasses(node, 'exit');

		this.addClass(node, className);

		if (this.props.onEnter) {
			this.props.onEnter(node);
		}
	};

	onEntering = (node, appearing) => {
		const { activeClassName } = this.getClassNames(
			appearing ? 'appear' : 'enter'
		);

		this.reflowAndAddClass(node, activeClassName);

		if (this.props.onEntering) {
			this.props.onEntering(node);
		}
	};

	onEntered = (node, appearing) => {
		this.removeClasses(node, appearing ? 'appear' : 'enter');

		if (this.props.onEntered) {
			this.props.onEntered(node);
		}

		if (this.props.routeId) {
			eventService.dispatchObjectEvent('route:' + this.props.routeId);
		}
	};

	onExit = (node) => {
		const { className } = this.getClassNames('exit');

		this.removeClasses(node, 'appear');
		this.removeClasses(node, 'enter');
		this.addClass(node, className);

		if (this.props.onExit) {
			this.props.onExit(node);
		}
	};

	onExiting = (node) => {
		const { activeClassName } = this.getClassNames('exit');

		this.reflowAndAddClass(node, activeClassName);

		if (this.props.onExiting) {
			this.props.onExiting(node);
		}
	};

	onExited = (node) => {
		this.removeClasses(node, 'exit');

		if (this.props.onExited) {
			this.props.onExited(node);
		}
	};

	getClassNames = (type) => {
		let className;
		let activeClassName;

		const { classNames } = this.props;

		if (typeof classNames !== 'string') {
			className = classNames[type];
		} else {
			className = classNames + '-' + type;
		}

		if (typeof classNames !== 'string') {
			activeClassName = classNames[type + 'Active'];
		} else {
			activeClassName = className + '-active';
		}

		return { className, activeClassName };
	};

	removeClasses(node, type) {
		const { className, activeClassName } = this.getClassNames(type);
		className && this.removeClass(node, className);
		activeClassName && this.removeClass(node, activeClassName);
	}

	reflowAndAddClass(node, className) {
		// This is for to force a repaint,
		// which is necessary in order to transition styles when adding a class name.
		/* eslint-disable no-unused-expressions */
		if (node) {
			node.scrollTop;

			scrollTo(window, { top: 0, behavior: 'auto' });
			scrollTo(scrollService.scrollOriginalElement, {
				top: 0,
				behavior: 'auto',
			});
		}
		/* eslint-enable no-unused-expressions */
		this.addClass(node, className);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return true;
	}

	render() {
		const props = { ...this.props };

		delete props.classNames;

		return (
			<Transition
				{...props}
				onEnter={this.onEnter}
				onEntered={this.onEntered}
				onEntering={this.onEntering}
				onExit={this.onExit}
				onExiting={this.onExiting}
				onExited={this.onExited}
			/>
		);
	}
}

CSSTransition.propTypes = propTypes;

export default CSSTransition;
