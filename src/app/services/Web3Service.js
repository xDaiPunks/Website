import axios from 'axios';

import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';

import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';

import AbiService from 'src/app/services/AbiService';
import UserService from 'src/app/services/UserService';
import EventService from 'src/app/services/EventService';
import ConfigService from 'src/app/services/ConfigService';
import UtilityService from 'src/app/services/UtilityService';

let Instance;

const bip39 = require('bip39');
const hdkey = require('ethereumjs-wallet').hdkey;

const abiService = new AbiService();
const userService = new UserService();
const eventService = new EventService();
const configService = new ConfigService();
const utilityService = new UtilityService();

class Web3Service {
	constructor() {
		if (!Instance) {
			Instance = this;

			Instance.walletSigner = null;
			Instance.walletChainId = null;
			Instance.walletProvider = null;
			Instance.walletConnector = null;
			Instance.walletConnectorType = null; // mm or wc

			Instance.gasStatusTimeout = null;

			Instance.guid = utilityService.guid();

			Instance.httpProvider = configService.web3.httpProvider;
			Instance.socketProvider = configService.web3.socketProvider;

			Instance.checkGasStatus();
		}

		return Instance;
	}

	isAddress(address) {
		return ethers.utils.isAddress(address);
	}

	addProvider() {
		const vm = this;

		vm.provider = new ethers.providers.JsonRpcProvider({
			url: configService.web3.web3HttpProvider,
		});
	}

	checkWeb3() {
		const vm = this;

		return new Promise((resolve, reject) => {
			let connector;

			let ethereum;
			let connected;

			if (vm.walletConnector) {
				connector = vm.walletConnector;
			} else {
				connector = new WalletConnect({
					bridge: 'https://bridge.walletconnect.org',
					qrcodeModal: QRCodeModal,
				});
			}

			if (connector.connected) {
				vm.walletConnector = connector;

				vm.addWeb3Events();

				if (connector.accounts && connector.accounts.length > 0) {
					userService.address = connector.accounts[0];
					resolve({ result: 'success' });
				}
			} else {
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
			}
		});
	}

	addWeb3Events() {
		let ethereum;

		const vm = this;

		if (vm.walletConnector) {
			vm.walletConnector.off('connect');
			vm.walletConnector.off('disconnect');
			vm.walletConnector.off('session_update');

			vm.walletConnector.on('connect', (error, payload) => {
				if (error) {
					throw error;
				}

				// Get provided accounts and chainId
				const { accounts, chainId } = payload.params[0];

				console.log(chainId);
				console.log(accounts);
			});

			vm.walletConnector.on('session_update', (error, payload) => {
				if (error) {
					throw error;
				}

				// Get updated accounts and chainId
				const { accounts, chainId } = payload.params[0];

				console.log(chainId);
				console.log(accounts);
			});

			vm.walletConnector.on('disconnect', (error, payload) => {
				vm.walletConnector.off('connect');
				vm.walletConnector.off('disconnect');
				vm.walletConnector.off('session_update');

				vm.walletConnector = null;
			});
		}

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
			vm.walletProvider = new ethers.providers.Web3Provider(
				window.ethereum,
				'any'
			);

			vm.walletProvider
				.send('eth_requestAccounts', [])
				.then((response) => {
					vm.walletSigner = vm.walletProvider.getSigner();
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
			if (!vm.walletSigner) {
				reject({ result: 'error', errorType: 'noSigner' });
			} else {
				vm.walletSigner
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
						resolve({ result: 'success' });
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

	connectWalletConnect() {
		const vm = this;
		return new Promise((resolve, reject) => {
			let connector;
			if (vm.walletConnector) {
				connector = vm.walletConnector;
			} else {
				connector = new WalletConnect({
					bridge: 'https://bridge.walletconnect.org',
					qrcodeModal: QRCodeModal,
				});
			}

			if (!connector.connected) {
				// create new session
				connector.createSession();
			}

			vm.walletConnector = connector;

			if (connector.accounts && connector.accounts.length > 0) {
				userService.address = connector.accounts[0];
			}

			// Subscribe to connection events
			connector.on('connect', (error, payload) => {
				if (error) {
					throw error;
				}

				// Get provided accounts and chainId
				const { accounts, chainId } = payload.params[0];

				console.log(accounts, chainId);
			});

			connector.on('session_update', (error, payload) => {
				if (error) {
					throw error;
				}

				// Get updated accounts and chainId
				const { accounts, chainId } = payload.params[0];
				console.log(accounts, chainId);
			});

			connector.on('disconnect', (error, payload) => {
				if (error) {
					throw error;
				}

				// Delete connector
			});

			resolve({ result: 'success' });
		});
	}

	parseNumber(value, unit) {
		if (!unit) {
			unit = 'ether';
		}

		return ethers.utils.parseUnits(value, unit);
	}

	formatNumber(value, unit) {
		if (!unit) {
			unit = 'ether';
		}

		return ethers.utils.formatUnits(value, unit);
	}

	convertKeccak256(string) {
		return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(string));
	}

	calculateGasCost(gasUsed, gasPrice, formatCount) {
		formatCount = formatCount || 6;

		const gasUsedBN = BigNumber(gasUsed);
		const gasPriceBN = BigNumber(gasPrice);

		return gasUsedBN.times(gasPriceBN).div(1e18).toFormat(formatCount);
	}

	calculateGas(turbo, gasPrice, estimateGas, transaction) {
		let mul;

		let gasLimit;
		let gasPriceTurbo;

		const minGasPriceTurbo = ethers.BigNumber.from(
			configService.web3.gasPrice
		);

		if (turbo !== true) {
			mul = 1;
		} else {
			mul = configService.web3.gasMultiply;
		}

		// 15 div 10 is 1.5. ethers.BigNumber only takes integers
		gasLimit = estimateGas.mul(ethers.BigNumber.from(15)).div(10);
		gasPriceTurbo = gasPrice.div(10).mul(ethers.BigNumber.from(mul));

		if (gasPriceTurbo.lt(minGasPriceTurbo)) {
			gasPriceTurbo = minGasPriceTurbo;
		}

		return {
			gasLimit: gasLimit,
			gasPrice: gasPriceTurbo,
		};
	}

	checkGasStatus() {
		const vm = this;

		clearTimeout(vm.gasStatusTimeout);

		axios
			.get(configService.web3.gasOracleUrl)
			.then((response) => {
				if (!response || !response.data || !response.data.fast) {
					vm.gasPrice = configService.web3.gasPrice;
				} else {
					vm.gasPrice = BigNumber(10e9)
						.times(BigNumber(response.data.fast))
						.toString();
				}

				vm.gasStatusTimeout = setTimeout(() => {
					vm.checkGasStatus();
				}, 150000);
			})
			.catch((responseError) => {
				vm.gasPrice = configService.web3.gasPrice;

				vm.gasStatusTimeout = setTimeout(() => {
					vm.checkGasStatus();
				}, 150000);
			});
	}

	getCode(accountAddress) {
		const vm = this;

		return new Promise((resolve, reject) => {
			vm.provider
				.getCode(accountAddress)
				.then((code) => {
					resolve(code);
				})
				.catch((codeError) => {
					reject(codeError);
				});
		});
	}

	getBlock(blockNumber, includeTransactions) {
		const vm = this;

		return new Promise((resolve, reject) => {
			if (includeTransactions === false) {
				vm.provider
					.getBlock(blockNumber)
					.then((block) => {
						resolve(block);
					})
					.catch((blockError) => {
						reject(blockError);
					});
			} else {
				vm.provider
					.getBlockWithTransactions(blockNumber)
					.then((block) => {
						resolve(block);
					})
					.catch((blockError) => {
						reject(blockError);
					});
			}
		});
	}

	getBlockNumber() {
		const vm = this;
		return new Promise((resolve, reject) => {
			vm.provider
				.getBlockNumber()
				.then((blockNumber) => {
					resolve(blockNumber);
				})
				.catch((blockNumberError) => {
					reject(blockNumberError);
				});
		});
	}

	getBalance(accountAddress) {
		const vm = this;
		return new Promise((resolve, reject) => {
			vm.provider
				.getBalance(accountAddress)

				.then((balance) => {
					resolve(balance.toString());
				})
				.catch((balanceError) => {
					reject(balanceError);
				});
		});
	}

	getTransaction(transactionHash) {
		const vm = this;
		return new Promise((resolve, reject) => {
			vm.provider
				.getTransaction(transactionHash)
				.then((transaction) => {
					resolve(transaction);
				})
				.catch((transactionError) => {
					reject(transactionError);
				});
		});
	}

	getTransactionCount(address, blockTag) {
		const vm = this;

		return new Promise((resolve, reject) => {
			if (!blockTag) {
				blockTag = 'latest';
			}

			vm.provider
				.getTransactionCount(address, blockTag)
				.then((transactionCount) => {
					resolve(transactionCount);
				})
				.catch((transactionCountError) => {
					reject(transactionCountError);
				});
		});
	}

	getTransactionReceipt(transactionHash) {
		const vm = this;
		return new Promise((resolve, reject) => {
			vm.provider
				.getTransactionReceipt(transactionHash)
				.then((transactionReceipt) => {
					resolve(transactionReceipt);
				})
				.catch((transactionReceiptError) => {
					reject(transactionReceiptError);
				});
		});
	}

	generateAccount(privateKey) {
		let wallet;

		let accountAddress;
		let accountPrivateKey;

		if (!privateKey) {
			wallet = ethers.Wallet.createRandom();
		} else {
			wallet = new ethers.Wallet(privateKey);
		}

		accountAddress = wallet.address;
		accountPrivateKey = wallet.privateKey;

		return {
			accountAddress,
			accountPrivateKey,
		};
	}

	generateAccountMnemonic(mnemonic) {
		const seed = bip39.mnemonicToSeedSync(mnemonic);
		const hdWallet = hdkey.fromMasterSeed(seed);

		// eslint-disable-next-line quotes
		const hdPathWallet = "m/44'/60'/0'/0/";

		const wallet = hdWallet.derivePath(hdPathWallet + 0).getWallet();
		const accountAddress = '0x' + wallet.getAddress().toString('hex');
		const accountPrivateKey = wallet.getPrivateKey().toString('hex');

		return {
			accountAddress,
			accountPrivateKey,
		};
	}

	generateAccountsMnemonic(mnemonic, count) {
		let i;

		const accounts = [];

		const seed = bip39.mnemonicToSeedSync(mnemonic);
		const hdWallet = hdkey.fromMasterSeed(seed);

		// eslint-disable-next-line quotes
		const hdPathWallet = "m/44'/60'/0'/0/";

		// eslint-disable-next-line no-restricted-globals
		if (isNaN(parseInt(count, 10))) {
			count = 1;
		} else {
			count = parseInt(count, 10);
		}

		for (i = 0; i < count; i++) {
			const wallet = hdWallet.derivePath(hdPathWallet + i).getWallet();
			const accountAddress = '0x' + wallet.getAddress().toString('hex');
			const accountPrivateKey = wallet.getPrivateKey().toString('hex');

			accounts.push({
				accountAddress,
				accountPrivateKey,
			});
		}

		return accounts;
	}
}

export default Web3Service;
