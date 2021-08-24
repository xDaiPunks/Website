/*
 * We use dotenv for setting variables
 * process.env evaluates everything to strings
 * We need to evaluate eveything as a string value
 */
let Instance;

class ServerService {
	constructor() {
		if (!Instance) {
			Instance = this;

			Instance.base = this.generateBase();
			Instance.appUrl = this.generateAppUrl();
			Instance.socketUrl = this.generateSignalUrl();
		}
		return Instance;
	}

	production() {
		return process.env.REACT_APP_PRODUCTION;
	}

	generateBase() {
		return this.generateAppUrl() + '/';
	}

	generateAppUrl() {
		if (
			parseInt(process.env.REACT_APP_PORT, 10) === 80 ||
			parseInt(process.env.REACT_APP_PORT, 10) === 443
		) {
			return (
				process.env.REACT_APP_TRANSPORT + '://' + process.env.REACT_APP_HOST
			);
		} else {
			return (
				process.env.REACT_APP_TRANSPORT +
				'://' +
				process.env.REACT_APP_HOST +
				':' +
				process.env.REACT_APP_PORT
			);
		}
	}

	generateApiUrl(endpoint, endpointOption) {
		if (process.env.REACT_APP_MOCKED_RESPONSE !== 'true') {
			return this.appUrl + process.env.REACT_APP_API_PREFIX + '/' + endpoint;
		}

		if (process.env.REACT_APP_MOCKED_RESPONSE === 'true') {
			if (!endpointOption) {
				return this.appUrl + process.env.REACT_APP_API_PREFIX + '/' + endpoint;
			} else {
				return (
					this.appUrl +
					process.env.REACT_APP_API_PREFIX +
					'/' +
					endpoint +
					'.' +
					endpointOption
				);
			}
		}
	}

	generateSignalUrl(endpoint, endpointOption) {
		if (process.env.REACT_APP_MOCKED_RESPONSE !== 'true') {
			if (!endpoint) {
				return this.appUrl + process.env.REACT_APP_SOCKET_PREFIX;
			} else {
				return (
					this.appUrl + process.env.REACT_APP_SOCKET_PREFIX + '/' + endpoint
				);
			}
		}

		if (process.env.REACT_APP_MOCKED_RESPONSE === 'true') {
			if (!endpointOption) {
				if (!endpoint) {
					return this.appUrl + process.env.REACT_APP_SOCKET_PREFIX;
				} else {
					return (
						this.appUrl + process.env.REACT_APP_SOCKET_PREFIX + '/' + endpoint
					);
				}
			} else {
				if (!endpoint) {
					return this.appUrl + process.env.REACT_APP_SOCKET_PREFIX;
				} else {
					return (
						this.appUrl +
						process.env.REACT_APP_SOCKET_PREFIX +
						'/' +
						endpoint +
						'.' +
						endpointOption
					);
				}
			}
		}
	}
}

export default ServerService;
