import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';

import UserService from 'src/app/services/UserService';
import EventService from 'src/app/services/EventService';
import ConfigService from 'src/app/services/ConfigService';
import UtilityService from 'src/app/services/UtilityService';

let Instance;

const userService = new UserService();
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
			Instance.web3Provider = null;

			Instance.guid = utilityService.guid();
		}

		return Instance;
	}

	isAddress(address) {
		return ethers.utils.isAddress(address);
	}

	checkWeb3() {
		const vm = this;

		return new Promise((resolve, reject) => {
			let ethereum;
			let connected;

			if (!window.ethereum) {
				resolve({ result: 'success' });
			} else {
				ethereum = window.ethereum;

				connected = ethereum.isConnected();

				if (connected !== true) {
					resolve({ result: 'success' });
				} else {
					vm.addWeb3Events();

					if (!ethereum.selectedAddress) {
						resolve({ result: 'success' });
					} else {
						userService.address = ethereum.selectedAddress;
						resolve({ result: 'success' });
					}
				}
			}
		});
	}

	addWeb3Events() {
		let ethereum;

		const vm = this;

		if (window.ethereum) {
			ethereum = window.ethereum;

			ethereum.on('disconnect', (accountArray) => {
				console.log('disconnect event', accountArray);

				eventService.off('preloader:show', vm.guid);
				eventService.on('preloader:show', vm.guid, () => {
					eventService.off('preloader:show', vm.guid);
					if (accountArray.length === 0) {
						userService.address = null;
					} else {
						userService.address = accountArray[0];
					}

					eventService.dispatchObjectEvent('force:state');
					eventService.dispatchObjectEvent('hide:preloader');
				});

				eventService.dispatchObjectEvent('show:preloader');
			});

			ethereum.on('connect', (event) => {
				console.log('connect event', event);
			});

			ethereum.on('chainChanged', (event) => {
				console.log('chainChange event', event);
			});

			ethereum.on('accountsChanged', (accountArray) => {
				console.log('accountChange event', accountArray);

				eventService.off('preloader:show', vm.guid);
				eventService.on('preloader:show', vm.guid, () => {
					eventService.off('preloader:show', vm.guid);
					if (accountArray.length === 0) {
						userService.address = null;
					} else {
						userService.address = accountArray[0];
					}

					eventService.dispatchObjectEvent('force:state');
					eventService.dispatchObjectEvent('hide:preloader');
				});

				eventService.dispatchObjectEvent('show:preloader');
			});
		}
	}

	getAccounts() {
		const vm = this;

		return new Promise((resolve, reject) => {
			vm.provider = new ethers.providers.Web3Provider(
				window.ethereum,
				'any'
			);

			vm.provider
				.send('eth_requestAccounts', [])
				.then((response) => {
					vm.signer = vm.provider.getSigner();
					resolve({ result: 'success' });
				})
				.catch((responseError) => {
					reject({ result: 'error', errorType: 'getAccountsError' });
				});
		});
	}

	getSignerAddress() {
		const vm = this;

		return new Promise((resolve, reject) => {
			if (!vm.signer) {
				reject({ result: 'error', errorType: 'noSigner' });
			} else {
				vm.signer
					.getAddress()
					.then((signerResponse) => {
						userService.address = signerResponse;
						resolve({ result: 'success' });
					})
					.catch((signerResponseError) => {
						reject({
							result: 'error',
							errorType: 'getSignerAddresError',
						});
					});
			}
		});
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
						reject({
							result: 'error',
							errorType: 'requestAccountsError',
						});
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
						reject({
							result: 'error',
							errorType: 'getSignerAddressError',
						});
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
							reject({
								result: 'error',
								errorType: 'swicthEthereumChainError',
							});
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
						reject({ result: 'success' });
					})
					.catch((responseError) => {
						reject({
							result: 'error',
							errorType: 'metaMaskAddError',
						});
					});
			}
		});
	}

	connectWalletConnect() {}
}

export default Web3Service;
