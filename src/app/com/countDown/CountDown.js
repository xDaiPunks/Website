import React, { PureComponent } from 'react';

import ConfigService from 'src/app/services/ConfigService';
import UtilityService from 'src/app/services/UtilityService';

const configService = new ConfigService();
const utilityService = new UtilityService();

class CountDown extends PureComponent {
	constructor(props) {
		super(props);

		this.timeInteval = null;

		this.state = {
			days: null,
			hours: null,
			minutes: null,
			seconds: null,

			active: true,

			countDown: configService.countDown,
		};

		this.setDate = this.setDate.bind(this);
		this.startCountDown = this.startCountDown.bind(this);
	}

	componentDidMount() {
		const vm = this;
		vm.startCountDown();
	}

	setDate() {
		let timeDiff;
		let countDown;

		const vm = this;
		const time = new Date().getTime();

		const state = utilityService.cloneObject(vm.state);

		countDown = state.countDown;
		timeDiff = countDown - time;

		if (timeDiff >= 0) {
			state.active = true;
		} else {
			state.active = false;
		}

		state.days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
		state.hours = Math.floor(
			(timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		state.minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
		state.seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

		vm.setState(state);
	}

	startCountDown() {
		const vm = this;
		clearInterval(vm.timeInteval);

		vm.setDate();

		vm.timeInteval = setInterval(() => {
			if (vm.state.active === true) {
				vm.setDate();
			} else {
				clearInterval(vm.timeInteval);
			}
		}, 1000);
	}

	componentWillUnmount() {
		const vm = this;
		clearInterval(vm.timeInteval);
	}

	render() {
		const vm = this;
		const days = vm.state.days;
		const hours = vm.state.hours;
		const minutes = vm.state.minutes;
		const seconds = vm.state.seconds;

		if (vm.state.active === false) {
			return null;
		} else {
			return (
				<div className="CountDown">
					<div className="TimeText">{days + 'd'}</div>
					<div className="TextDots">:</div>
					<div className="TimeText">{hours + 'h'}</div>
					<div className="TextDots">:</div>
					<div className="TimeText">{minutes + 'm'}</div>
					<div className="TextDots">:</div>
					<div className="TimeText">{seconds + 's'}</div>
				</div>
			);
		}
	}
}

export default CountDown;
