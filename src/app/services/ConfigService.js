let Instance;

class ConfigService {
	constructor() {
		if (!Instance) {
			Instance = this;

			Instance.defaultLanguage = 'en';
			Instance.selectedLanguage = '';
			Instance.availableLanguages = ['en', 'es'];

			Instance.userImageUrl = process.env.REACT_APP_USER_IMAGE_URL;

			Instance.apiUrl =
				process.env.REACT_APP_API_DOMAIN +
				process.env.REACT_APP_API_PREFIX;
		}

		return Instance;
	}
}

export default ConfigService;
