/*
 * Create a singleton class so it can be used anywhere
 */

//import createHistory from 'history/createBrowserHistory';
import { createBrowserHistory } from 'history';

let Instance;

class HistoryService {
	constructor() {
		if (!Instance) {
			Instance = this;
			Instance.history = createBrowserHistory();
		}

		return Instance;
	}
}

export default HistoryService;
