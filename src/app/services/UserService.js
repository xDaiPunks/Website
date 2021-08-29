/* eslint-disable no-unused-vars */

import ConfigService from 'src/app/services/ConfigService';
import ServerService from 'src/app/services/ServerService';
import UtilityService from 'src/app/services/UtilityService';

let Instance;

const configService = new ConfigService();
const serverService = new ServerService();
const utilityService = new UtilityService();

class UserService {
	constructor() {
		if (!Instance) {
			Instance = this;

			Instance.addressStore = null;
			Instance.userSignedInStore = null;
		}

		return Instance;
	}

	get address() {
		const vm = this;
		return vm.addressStore;
	}

	set address(val) {
		const vm = this;
		vm.addressStore = val;
	}

	get userSignedIn() {
		const vm = this;
		return vm.userSignedInStore;
	}

	set userSignedIn(val) {
		const vm = this;
		vm.userSignedInStore = val;
	}
}

export default UserService;
