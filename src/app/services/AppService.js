/* eslint-disable no-unused-vars */

import axios from 'axios';

import PunkService from 'src/app/services/PunkService';
import UserService from 'src/app/services/UserService';
import Web3Service from 'src/app/services/Web3Service';
import EventService from 'src/app/services/EventService';
import RouteService from 'src/app/services/RouteService';
import ConfigService from 'src/app/services/ConfigService';
import StorageService from 'src/app/services/StorageService';
import UtilityService from 'src/app/services/UtilityService';
import TranslationService from 'src/app/services/TranslationService';

let Instance;

const punkService = new PunkService();
const userService = new UserService();
const web3Service = new Web3Service();
const eventService = new EventService();
const routeService = new RouteService();
const configService = new ConfigService();
const storageService = new StorageService();
const utilityService = new UtilityService();
const translationService = new TranslationService();

class AppService {
	constructor() {
		if (!Instance) {
			Instance = this;
			Instance.guid = utilityService.guid();

			Instance.setupLanguageConfig();

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
			promiseArray.push(vm.walletData());
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
					resolve({ result: 'success' });
				});
		});
	}

	walletData() {
		const vm = this;

		return new Promise((resolve, reject) => {
			web3Service
				.checkWallet()
				.then((response) => {
					resolve({ result: 'success' });
				})
				.catch((responseError) => {
					resolve({ result: 'success' });
				});
		});
	}

	blockchainData() {
		const vm = this;
		const promiseArray = [];

		// public sale
		// mints remaining
		// punks owned by wallet

		promiseArray.push(publicSale());
		promiseArray.push(mintsRemaining());

		Promise.all(promiseArray)
			.then((responses) => {
				console.log(responses);
			})
			.catch((responsesError) => {
				console.log(responsesError);
			});

		function publicSale() {
			return new Promise((resolve, reject) => {
				web3Service
					.publicSale()
					.then((response) => {
						console.log('Public sale', response);
						resolve(response);
					})
					.catch((responseError) => {
						console.log('Public sale', responseError);
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
						console.log('Mints remaining', responseError);
						resolve(responseError);
					});
			});
		}
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

	checkWeb3() {
		return new Promise((resolve, reject) => {
			web3Service
				.checkWeb3()
				.then((response) => {
					resolve({ result: 'success' });
				})
				.catch((responseError) => {
					resolve({ result: 'success' });
				});
		});
	}

	setupLanguageConfig() {
		let browserLanguage;
		let selectedLanguage;
		let languageConfigObject;
		let countriesConfigObject;

		const defaultLanguage = configService.defaultLanguage;
		const availableLanguages = configService.availableLanguages;

		browserLanguage = utilityService.browserSupport.language.substr(0, 2);
		selectedLanguage = storageService.getItem('selectedLanguage');

		if (selectedLanguage !== null) {
			configService.selectedLanguage = selectedLanguage;
		} else {
			if (availableLanguages.includes(browserLanguage)) {
				configService.selectedLanguage = browserLanguage;
			} else {
				configService.selectedLanguage = defaultLanguage;
			}
		}

		storageService.setItem(
			'selectedLanguage',
			configService.selectedLanguage
		);

		languageConfigObject = require('src/translations/' +
			configService.selectedLanguage +
			'.json');

		countriesConfigObject = require('src/translations/' +
			configService.selectedLanguage +
			'.countries.json');

		translationService.setTranslationConfig(languageConfigObject);
		translationService.setCountryTranslationConfig(countriesConfigObject);
	}

	checkLanguageConfig() {
		const vm = this;
		return new Promise((resolve, reject) => {
			let lang;
			const search = utilityService.getSearch();

			if (!search.hasOwnProperty('lang')) {
				resolve({ result: 'success' });
			} else {
				lang = search.lang.toLowerCase();
				if (
					lang === configService.selectedLanguage ||
					configService.availableLanguages.includes(lang) === false
				) {
					resolve({ result: 'success' });
				} else {
					vm.changeLanguage(lang);
					resolve({ result: 'success' });
				}
			}
		});
	}

	changeLanguage(language) {
		let selectedLanguage;
		let languageConfigObject;
		let countriesConfigObject;

		const defaultLanguage = configService.defaultLanguage;
		const availableLanguages = configService.availableLanguages;

		selectedLanguage = storageService.getItem('selectedLanguage');

		if (language === selectedLanguage) {
			return;
		} else {
			if (availableLanguages.includes(language) === true) {
				selectedLanguage = language;
			} else {
				selectedLanguage = defaultLanguage;
			}

			storageService.setItem('selectedLanguage', selectedLanguage);

			configService.selectedLanguage = selectedLanguage;

			languageConfigObject = require('src/translations/' +
				configService.selectedLanguage +
				'.json');

			countriesConfigObject = require('src/translations/' +
				configService.selectedLanguage +
				'.countries.json');

			translationService.setTranslationConfig(languageConfigObject);
			translationService.setCountryTranslationConfig(
				countriesConfigObject
			);
		}
	}

	changeLanguageConfig(language) {
		let selectedLanguage;
		let languageConfigObject;
		let countriesConfigObject;

		const defaultLanguage = configService.defaultLanguage;
		const availableLanguages = configService.availableLanguages;

		selectedLanguage = storageService.getItem('selectedLanguage');

		if (language === selectedLanguage) {
			return;
		} else {
			if (availableLanguages.includes(language) === true) {
				selectedLanguage = language;
			} else {
				selectedLanguage = defaultLanguage;
			}

			storageService.setItem('selectedLanguage', selectedLanguage);

			configService.selectedLanguage = selectedLanguage;

			languageConfigObject = require('src/translations/' +
				configService.selectedLanguage +
				'.json');

			countriesConfigObject = require('src/translations/' +
				configService.selectedLanguage +
				'.countries.json');

			translationService.setTranslationConfig(languageConfigObject);
			translationService.setCountryTranslationConfig(
				countriesConfigObject
			);

			routeService.scrollBackToTop('smooth');
			eventService.dispatchObjectEvent(
				'change:language',
				selectedLanguage
			);
		}
	}
}

export default AppService;
