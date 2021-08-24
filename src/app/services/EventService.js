import UtilityService from 'src/app/services/UtilityService';

let Instance;

const utilityService = new UtilityService();

class EventService {
	constructor() {
		if (!Instance) {
			Instance = this;
			utilityService.addObjectEventDispatcher(Instance);
		}
		return Instance;
	}
}

export default EventService;
