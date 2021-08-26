/* eslint-disable no-unused-vars */

import axios from 'axios';

import UserService from 'src/app/services/UserService';
import Web3Service from 'src/app/services/Web3Service';
import EventService from 'src/app/services/EventService';
import RouteService from 'src/app/services/RouteService';
import ConfigService from 'src/app/services/ConfigService';
import StorageService from 'src/app/services/StorageService';
import UtilityService from 'src/app/services/UtilityService';
import TranslationService from 'src/app/services/TranslationService';

let Instance;

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

			Instance.setupLanguageConfig();
		}

		return Instance;
	}

	getInitData() {
		const vm = this;

		return new Promise((resolve, reject) => {
			const promiseArray = [];
			const location = utilityService.generateLocation(
				window.location.href
			);

			promiseArray.push(vm.checkWeb3());
			promiseArray.push(vm.publicSale());
			promiseArray.push(vm.mintsRemaining());

			/*
			promiseArray.push(vm.getRates());

			if (location.pathname.indexOf('/app/request/') !== -1) {
				promiseArray.push(vm.getUserData());
			}
			*/

			Promise.all(promiseArray)
				.then((responses) => {
					resolve({ result: 'success' });
				})
				.catch((responsesError) => {
					reject({ result: 'error', errorType: 'initializeError' });
				});

			function getUserPunks() {}
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

	publicSale() {
		return new Promise((resolve, reject) => {
			web3Service
				.publicSale()
				.then((response) => {
					console.log('Public sale', response);
					resolve({ result: 'success' });
				})
				.catch((responseError) => {
					console.log('Public sale', responseError);
					resolve({ result: 'success' });
				});
		});
	}

	mintsRemaining() {
		return new Promise((resolve, reject) => {
			web3Service
				.mintsRemaining()
				.then((response) => {
					resolve({ result: 'success' });
				})
				.catch((responseError) => {
					console.log('Mints remaining', responseError);
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
