import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';

import EventService from 'src/app/services/EventService';
import ConfigService from 'src/app/services/ConfigService';
import UtilityService from 'src/app/services/UtilityService';

let Instance;

const eventService = new EventService();
const configService = new ConfigService();
const utilityService = new UtilityService();

class Web3Service {
	constructor() {
		if (!Instance) {
			Instance = this;
			Instance.signer = null;
			Instance.chainId = null;
			Instance.provider = null;
            Instance.signerAddress = null;

			Instance.addMetaMaskEvents();
		}

		return Instance;
	}

	connectMetaMask() {
		const vm = this;

		return new Promise((resolve, reject) => {
			let signer;
			let provider;

			let ethereum;

			if (!window.ethereum) {
				reject({ result: 'error', errorType: 'noMetaMask' });
			} else {
				ethereum = window.ethereum;
				provider = new ethers.providers.Web3Provider(
					window.ethereum,
					'any'
				);

				provider
					.send('eth_requestAccounts', [])
					.then((response) => {
						console.log(response);
						signer = provider.getSigner();
						getSignerAddress(signer, provider);
					})
					.catch((responseError) => {
						console.log(responseError);
					});
			}

			function getSignerAddress(signer, provider) {
				signer
					.getAddress()
					.then((signerResponse) => {
						console.log(signerResponse);
						const signerAddress = signerResponse;
						checkCurrentNetwork(signer, provider, signerAddress);
					})
					.catch((signerResponseError) => {
						console.log(signerResponseError);
					});
			}

			function checkCurrentNetwork(signer, provider, signerAddress) {
				const xdaiConfig = configService.web3.xdaiConfig;
				ethereum
					.request({
						method: 'wallet_switchEthereumChain',
						params: [{ chainId: xdaiConfig.chainId }],
					})
					.then((response) => {
						resolve({ result: 'success' });
					})
					.catch((responseError) => {
						if (responseError.code === 4902) {
							metaMaskaddNewNetwork(
								signer,
								provider,
								signerAddress
							);
						} else {
							console.log(responseError);
						}
					});
			}

			function metaMaskaddNewNetwork(signer, provider, signerAddress) {
				const xdaiConfig = configService.web3.xdaiConfig;
				ethereum
					.request({
						method: 'wallet_addEthereumChain',
						params: [xdaiConfig],
					})
					.then((response) => {
						console.log(response);
					})
					.catch((responseError) => {
						console.log(responseError);
					});
			}
		});
	}

	connectWalletConnect() {}

	addMetaMaskEvents() {
		let ethereum;

		const vm = this;

		if (window.ethereum) {
			ethereum = window.ethereum;
			console.log('ETHEREUM', ethereum.isConnected());

            console.log(ethereum);

			ethereum.on('disconnect', (event) => {
				console.log(event);
			});

			ethereum.on('connect', (event) => {
				console.log(event);
			});

			ethereum.on('chainChanged', (event) => {
				console.log(event);
			});

			ethereum.on('accountsChanged', (event) => {
				console.log(event);
			});

			vm.connectMetaMask()
				.then((response) => {
					console.log(response);
				})
				.catch((responseError) => {
					console.log(responseError);
				});
		}
	}
}

export default Web3Service;
