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

			Instance.requestStore = {};

			//utilityService.addObjectEventDispatcher(this);
		}
		return Instance;
	}

	get requestData() {
		const vm = this;
		return vm.requestStore;
	}

	set requestData(object) {
		const vm = this;
		vm.requestStore = object;
	}
}

export default UserService;
