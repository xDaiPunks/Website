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

			Instance.web3 = {
				gas: process.env.REACT_APP_WEB3_GAS,
				gasPrice: process.env.REACT_APP_WEB3_GAS_PRICE,
				gasLimit: process.env.REACT_APP_WEB3_GAS_LIMIT,
				gasMultiply: process.env.REACT_APP_WEB3_GAS_MULTIPLY,
				gasServiceLimit: process.env.REACT_APP_WEB3_GAS_SERVICE_LIMIT,

				gasOracleUrl: process.env.REACT_APP_WEB3_GAS_ORACLE_URL,
				xDaiPunksAddress: process.env.REACT_APP_WEB3_XDAI_PUNKS_ADDRESS,

				httpProvider: process.env.REACT_APP_WEB3_HTTP_PROVIDER,
				socketProvider: process.env.REACT_APP_WEB3_SOCKET_PROVIDER,

				xdaiConfig: {
					chainId: process.env.REACT_APP_WEB3_XDAI_CHAIN_ID,
					chainName: process.env.REACT_APP_WEB3_XDAI_CHAIN_NAME,
					nativeCurrency: {
						name: process.env.REACT_APP_WEB3_XDAI_CURRENCY_NAME,
						symbol: process.env.REACT_APP_WEB3_XDAI_CURRENCY_SYMBOL,
						decimals: parseInt(
							process.env.REACT_APP_WEB3_XDAI_CURRENCY_DECIMALS,
							10
						),
					},
					rpcUrls: [process.env.REACT_APP_WEB3_XDAI_RPC_URL],
					blockExplorerUrls: [
						process.env.REACT_APP_WEB3_XDAI_BLOCKCHAIN_EXPLORER_URL,
					],
				},
			};
		}

		return Instance;
	}
}

export default ConfigService;
