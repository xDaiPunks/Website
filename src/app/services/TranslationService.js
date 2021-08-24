import React from 'react';
import UtilityService from 'src/app/services/UtilityService';

let Instance;

const utilityService = new UtilityService();

class TranslationService {
	constructor() {
		if (!Instance) {
			Instance = this;
			Instance.translations = {}
			Instance.translationObject = {};

			Instance.countriesConfigObject = [];
		}
		return Instance;
	}

	translate(keyString) {
		if (!this.translationObject[keyString]) {
			return 'TRANSLATE';
		} else {
			if (this.translationObject[keyString].indexOf('/>') === -1) {
				return this.translationObject[keyString];
			} else {
				return React.createElement('div', {
					dangerouslySetInnerHTML: {
						__html: this.translationObject[keyString],
					},
				});
			}
		}
	}

	getTranslationConfig() {
		return this.translationObject;
	}

	setTranslationConfig(translationObject) {
		this.translations = translationObject;
		this.translationObject = utilityService.flattenObject(
			translationObject
		);
	}

	setCountryTranslationConfig(countriesConfigObject) {
		this.countriesConfigObject = countriesConfigObject;
	}
}

export default TranslationService;
