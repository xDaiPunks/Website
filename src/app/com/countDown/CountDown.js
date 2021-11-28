import React, { PureComponent } from 'react';

import UtilityService from 'src/app/services/UtilityService';

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

		const vm = this;
		const time = new Date().getTime();

		const state = utilityService.cloneObject(vm.state);

		timeDiff = vm.props.endDate - time;

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

		return (
			<>
				<span className="TimeText">{days + ' Days '}</span>
				<span className="TimeText">{hours + ' Hours '}</span>
				<span className="TimeText">{minutes + ' Minutes '}</span>
				<span className="TimeText">{seconds + ' Seconds'}</span>
			</>
		);
	}
}

export default CountDown;
