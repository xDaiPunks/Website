/* eslint-disable no-unused-vars */

import axios from 'axios';

import PunkService from 'src/app/services/PunkService';
import UserService from 'src/app/services/UserService';
import Web3Service from 'src/app/services/Web3Service';
import EventService from 'src/app/services/EventService';
import RouteService from 'src/app/services/RouteService';
import ConfigService from 'src/app/services/ConfigService';
import UtilityService from 'src/app/services/UtilityService';

let Instance;

const punkService = new PunkService();
const userService = new UserService();
const web3Service = new Web3Service();
const eventService = new EventService();
const routeService = new RouteService();
const configService = new ConfigService();
const utilityService = new UtilityService();

class AppService {
	constructor() {
		if (!Instance) {
			Instance = this;
			Instance.guid = utilityService.guid();

			eventService.on(
				'change:punkData',
				Instance.guid,
				(eventData) => {}
			);
		}

		return Instance;
	}

	getInitData() {
		const vm = this;

		return new Promise((resolve, reject) => {
			const promiseArray = [];

			promiseArray.push(vm.punkData());
			promiseArray.push(vm.blockchainData());

			Promise.all(promiseArray)
				.then((responses) => {
					if (userService.signedIn) {
						punkService.setPunkDetails();
					}

					resolve({ result: 'success' });
				})
				.catch((responsesError) => {
					reject({ result: 'error', errorType: 'initializeError' });
				});

			function getUserPunks() {}
		});
	}

	punkData() {
		return new Promise((resolve, reject) => {
			axios
				.get(configService.apiUrl + '/punkData')
				.then((response) => {
					const data = response.data;

					if (
						data &&
						data.responseData &&
						data.responseData.punkData
					) {
						punkService.generatePunkData(
							data.responseData.punkData
						);
					}

					resolve({ result: 'success' });
				})
				.catch((responseError) => {
					punkService.generatePunkData();
					resolve({ result: 'success' });
				});
		});
	}

	blockchainData() {
		const vm = this;
		return new Promise((resolve, reject) => {
			// public sale
			// mints remaining

			// we now direclty call the api

			axios
				.get(configService.apiUrl + '/init')
				.then((response) => {
					let val;
					const data = response.data;

					if (data.responseData) {
						if (data.responseData.hasOwnProperty('publicSale')) {
							punkService.publicSale =
								data.responseData.publicSale;
						}

						if (data.responseData.hasOwnProperty('mintsCount')) {
							punkService.mintsCount =
								data.responseData.mintsCount;
						}
					}

					if (
						punkService.publicSale === true ||
						punkService.publicSale === false
					) {
						if (punkService.mintsCount !== null) {
							val = true;
						}
					}

					if (val === true) {
						resolve({ result: 'success' });
					} else {
						web3BlockchainData();
					}
				})
				.catch((responseError) => {
					punkService.generatePunkData();
					resolve({ result: 'success' });
				});

			function web3BlockchainData() {
				const promiseArray = [];
				promiseArray.push(publicSale());
				promiseArray.push(mintsRemaining());

				Promise.all(promiseArray)
					.then((responses) => {
						resolve({ result: 'success' });
					})
					.catch((responsesError) => {
						resolve({ result: 'success' });
					});

				function publicSale() {
					return new Promise((resolve, reject) => {
						web3Service
							.publicSale()
							.then((response) => {
								resolve(response);
							})
							.catch((responseError) => {
								reject(responseError);
							});
					});
				}

				function mintsRemaining() {
					return new Promise((resolve, reject) => {
						web3Service
							.mintsRemaining()
							.then((response) => {
								resolve(response);
							})
							.catch((responseError) => {
								resolve(responseError);
							});
					});
				}
			}
			/*
			const promiseArray = [];
			promiseArray.push(publicSale());
			promiseArray.push(mintsRemaining());

			Promise.all(promiseArray)
				.then((responses) => {
					resolve({ result: 'success' });
				})
				.catch((responsesError) => {
					resolve({ result: 'success' });
				});

			function publicSale() {
				return new Promise((resolve, reject) => {
					web3Service
						.publicSale()
						.then((response) => {
							resolve(response);
						})
						.catch((responseError) => {
							reject(responseError);
						});
				});
			}

			function mintsRemaining() {
				return new Promise((resolve, reject) => {
					web3Service
						.mintsRemaining()
						.then((response) => {
							resolve(response);
						})
						.catch((responseError) => {
							resolve(responseError);
						});
				});
			}
			*/
		});
	}

	buyPunk(idx, amount) {
		return new Promise((resolve, reject) => {
			web3Service
				.buyPunk(idx, amount)
				.then((response) => {
					resolve(response);
				})
				.catch((responseError) => {
					reject(responseError);
				});
		});
	}

	mintPunks(number) {
		return new Promise((resolve, reject) => {
			web3Service
				.mintPunks(number)
				.then((response) => {
					resolve(response);
				})
				.catch((responseError) => {
					reject(responseError);
				});
		});
	}

	acceptBidForPunk(idx) {
		return new Promise((resolve, reject) => {
			web3Service
				.acceptBidForPunk(idx)
				.then((response) => {
					resolve(response);
				})
				.catch((responseError) => {
					reject(responseError);
				});
		});
	}

	enterBidForPunk(idx, amount) {
		return new Promise((resolve, reject) => {
			web3Service
				.enterBidForPunk(idx, amount)
				.then((response) => {
					resolve(response);
				})
				.catch((responseError) => {
					reject(responseError);
				});
		});
	}

	offerPunkForSale(idx, amount) {
		return new Promise((resolve, reject) => {
			web3Service
				.offerPunkForSale(idx, amount)
				.then((response) => {
					resolve(response);
				})
				.catch((responseError) => {
					reject(responseError);
				});
		});
	}

	withdrawBidForPunk(idx) {
		return new Promise((resolve, reject) => {
			web3Service
				.withdrawBidForPunk(idx)
				.then((response) => {
					resolve(response);
				})
				.catch((responseError) => {
					reject(responseError);
				});
		});
	}

	punkNoLongerForSale(idx) {
		return new Promise((resolve, reject) => {
			web3Service
				.punkNoLongerForSale(idx)
				.then((response) => {
					resolve(response);
				})
				.catch((responseError) => {
					reject(responseError);
				});
		});
	}

	withdraw() {
		return new Promise((resolve, reject) => {
			web3Service
				.withdraw()
				.then((response) => {
					resolve(response);
				})
				.catch((responseError) => {
					reject(responseError);
				});
		});
	}

	pendingWithdrawals(address) {
		return new Promise((resolve, reject) => {
			web3Service
				.pendingWithdrawals(address)
				.then((response) => {
					resolve(response);
				})
				.catch((responseError) => {
					reject(responseError);
				});
		});
	}
}

export default AppService;
