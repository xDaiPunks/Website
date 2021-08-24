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
			Instance.address = null;
			
		}
		return Instance;
	}
}

export default UserService;
