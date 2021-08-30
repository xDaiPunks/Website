import axios from 'axios';

import Web3 from 'web3';
import { BigNumber } from 'bignumber.js';

import WalletConnectProvider from '@walletconnect/web3-provider';

import AbiService from 'src/app/services/AbiService';
import PunkService from 'src/app/services/PunkService';
import UserService from 'src/app/services/UserService';
import EventService from 'src/app/services/EventService';
import ConfigService from 'src/app/services/ConfigService';
import UtilityService from 'src/app/services/UtilityService';

let Instance;

const bip39 = require('bip39');
const hdkey = require('ethereumjs-wallet').hdkey;

const xDaiPunksAbi = require('src/app//abi/xDaiPunks.json');

const abiService = new AbiService();
const punkService = new PunkService();
const userService = new UserService();
const eventService = new EventService();
const configService = new ConfigService();
const utilityService = new UtilityService();

class Web3Service {
	constructor() {
		if (!Instance) {
			Instance = this;

			Instance.contract = null;
			Instance.gasPrice = null;

			Instance.walletType = null; // mm or wc
			Instance.walletChainId = null;
			Instance.walletProvider = null;

			Instance.guid = utilityService.guid();

			Instance.httpProvider = configService.web3.httpProvider;
			Instance.socketProvider = configService.web3.socketProvider;

			Instance.xDaiPunksAddress = configService.web3.xDaiPunksAddress;

			Instance.initialize();
			Instance.checkGasStatus();
		}

		return Instance;
	}

	initialize() {
		const vm = this;

		vm.setAbi();
		vm.setContract();
		vm.setWeb3Events();
		vm.setContractEvents();
	}

	setAbi() {
		const vm = this;

		vm.xdaiPunksAbi = xDaiPunksAbi;
		vm.xDaiPunkAddress = vm.xDaiPunksAddress;
	}

	setContract() {
		const vm = this;
		const web3 = new Web3(vm.httpProvider);

		vm.web3 = web3;

		web3.eth.Contract.setProvider(vm.socketProvider);
		vm.contract = new web3.eth.Contract(
			vm.xdaiPunksAbi,
			vm.xDaiPunkAddress
		);
	}

	setWeb3Events() {
		let ethereum;
		let connector;

		let walletConnect;

		const vm = this;
		const rpcProvider = {};

		rpcProvider[1337] = configService.web3.httpProvider;

		connector = new WalletConnectProvider({
			rpc: rpcProvider,
		});

		if (connector.connected === true) {
			walletConnect = true;

			connector.on('accountsChanged', (accounts) => {
				console.log(accounts);
			});

			// Subscribe to chainId change
			connector.on('chainChanged', (chainId) => {
				console.log(chainId);
			});

			// Subscribe to session disconnection
			connector.on('disconnect', (code, reason) => {
				console.log(code, reason);
			});

			/*
			connector.on('session_update', (error, payload) => {
				if (error) {
				} else {
					const { accounts, chainId } = payload.params[0];

					console.log(accounts, chainId);

					console.log('accountChange event', accounts);

					eventService.off('preloader:show', vm.guid);
					eventService.on('preloader:show', vm.guid, () => {
						eventService.off('preloader:show', vm.guid);
						if (accounts.length === 0) {
							vm.walletType = 'wc';
							vm.walletChainId = chainId;

							userService.address = null;
							userService.userSignedIn = null;
						} else {
							vm.walletType = 'wc';
							vm.walletChainId = chainId;

							userService.userSignedIn = true;
							userService.address = accounts[0];

							punkService.setPunkDetails();
						}

						eventService.dispatchObjectEvent('force:state');
						eventService.dispatchObjectEvent('hide:preloader');
					});

					eventService.dispatchObjectEvent('show:preloader');
				}
			});
			*/
		}

		if (walletConnect !== true) {
			if (window.ethereum) {
				ethereum = window.ethereum;

				window.web3 = new Web3(ethereum);
				vm.walletProvider = window.web3;

				ethereum.on('disconnect', (accountArray) => {
					console.log('disconnect event', accountArray);

					eventService.off('preloader:show', vm.guid);
					eventService.on('preloader:show', vm.guid, () => {
						eventService.off('preloader:show', vm.guid);
						if (accountArray.length === 0) {
							vm.walletType = 'mm';
							vm.walletChainId = ethereum.chainId;

							userService.address = null;
							userService.userSignedIn = null;
						} else {
							vm.walletType = 'mm';
							vm.walletChainId = ethereum.chainId;

							userService.userSignedIn = true;
							userService.address = accountArray[0];

							punkService.setPunkDetails();
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
							vm.walletType = 'mm';
							vm.walletChainId = ethereum.chainId;

							userService.address = null;
							userService.userSignedIn = null;
						} else {
							vm.walletType = 'mm';
							vm.walletChainId = ethereum.chainId;

							userService.address = accountArray[0];
							userService.userSignedIn = true;

							punkService.setPunkDetails();
						}

						eventService.dispatchObjectEvent('force:state');
						eventService.dispatchObjectEvent('hide:preloader');
					});

					eventService.dispatchObjectEvent('show:preloader');
				});
			}
		}
	}

	setContractEvents() {
		const vm = this;
		vm.initializeContractEvents();
	}

	isAddress(address) {
		const vm = this;
		return vm.web3.utils.isAddress(address);
	}

	// general web3 functions
	getCode(accountAddress) {
		const vm = this;
		return new Promise((resolve, reject) => {
			vm.web3.eth
				.getCode(accountAddress)
				.then((code) => {
					resolve(code);
				})
				.catch((codeError) => {
					reject(codeError);
				});
		});
	}

	getPastEvents(fromBlock, toBlock) {
		const vm = this;

		return new Promise((resolve, reject) => {
			vm.contract
				.getPastEvents('allEvents', {
					fromBlock: fromBlock,
					toBlock: toBlock,
				})
				.then((response) => {
					resolve(response);
				})
				.catch((responseError) => {
					reject(responseError);
				});
		});
	}

	getBlock(blockNumber, includeTransactions) {
		const vm = this;

		return new Promise((resolve, reject) => {
			if (includeTransactions === false) {
				vm.web3.eth
					.getBlock(blockNumber)
					.then((block) => {
						resolve(block);
					})
					.catch((blockError) => {
						reject(blockError);
					});
			} else {
				vm.web3.eth
					.getBlock(blockNumber, true)
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
			vm.web3.eth
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
			vm.web3.eth
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
			vm.web3.eth
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

			vm.web3.eth
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
			vm.web3.eth
				.getTransactionReceipt(transactionHash)
				.then((transactionReceipt) => {
					resolve(transactionReceipt);
				})
				.catch((transactionReceiptError) => {
					reject(transactionReceiptError);
				});
		});
	}

	sendTransaction(signedTransaction) {
		const vm = this;

		return new Promise((resolve, reject) => {
			vm.web3.eth
				.sendTransaction(signedTransaction)
				.then((signedTransactionResponse) => {
					resolve(signedTransactionResponse);
				})
				.catch((signedTransactionResponseError) => {
					reject(signedTransactionResponseError);
				});
		});
	}

	sendSignedTransaction(rawTransaction) {
		const vm = this;

		return new Promise((resolve, reject) => {
			let signedTransactionHash;

			vm.web3.eth
				.sendSignedTransaction(rawTransaction)
				.on('error', (sendSignedTransactionError) => {
					reject({
						error: 'sendSignedTransactionError',
						message: sendSignedTransactionError,
						signedTransactionHash: signedTransactionHash,
					});
				})
				.on('receipt', (transactionReceipt) => {
					resolve({
						result: 'success',
						transactionReceipt,
					});
				})
				.on('transactionHash', (transactionHash) => {
					signedTransactionHash = transactionHash;
				});
		});
	}

	generateAccount(privateKey) {
		let wallet;

		let accountAddress;
		let accountPrivateKey;

		/*
		if (!privateKey) {
			wallet = ethers.Wallet.createRandom();
		} else {
			wallet = new ethers.Wallet(privateKey);
		}
		*/

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

	publicSale() {
		const vm = this;

		return new Promise((resolve, reject) => {
			vm.contract.methods
				.publicSale()
				.call()
				.then((publicSale) => {
					punkService.publicSale = publicSale;
					resolve(publicSale);
				})
				.catch((publicSaleError) => {
					reject(publicSaleError);
				});
		});
	}

	mintsRemaining() {
		const vm = this;

		return new Promise((resolve, reject) => {
			vm.contract.methods
				.mintsRemaining()
				.call()

				.then((mintsRemaining) => {
					let mintsCount;

					mintsCount = BigNumber(10000)
						.minus(BigNumber(mintsRemaining.toString()))
						.toNumber();

					punkService.mintsCount = mintsCount;
					resolve(mintsRemaining);
				})
				.catch((mintsRemainingError) => {
					reject(mintsRemainingError);
				});
		});
	}

	withdraw(address) {
		const vm = this;

		return new Promise((resolve, reject) => {
			let contract;

			contract = new vm.walletProvider.eth.Contract(
				vm.xdaiPunksAbi,
				vm.xDaiPunkAddress
			);

			contract.methods
				.withdraw()
				.send({
					gasPrice: vm.gasPrice,
					from: window.ethereum.selectedAddress,
				})
				.then((response) => {
					resolve(response);
					console.log(response);
				})
				.catch((responseError) => {
					reject(responseError);
					console.log(responseError);
				});
		});
	}

	pendingWithdrawals(address) {
		const vm = this;

		return new Promise((resolve, reject) => {
			vm.contract.methods
				.pendingWithdrawals(address)
				.call()

				.then((amount) => {
					resolve(amount);
				})
				.catch((amountError) => {
					reject(amountError);
				});
		});
	}

	tokensOfAddress(address) {
		const vm = this;

		return new Promise((resolve, reject) => {
			vm.contract.methods
				.tokensOfAddress(address)
				.call()

				.then((tokensOfAddress) => {
					userService.ownedPunks = tokensOfAddress;
					resolve(tokensOfAddress);
				})
				.catch((tokensOfAddressError) => {
					reject(tokensOfAddressError);
				});
		});
	}

	buyPunk(idx, amount) {
		const vm = this;

		return new Promise((resolve, reject) => {
			let contract;
			const value = BigNumber(amount).times(1e18).toString();

			contract = new vm.walletProvider.eth.Contract(
				vm.xdaiPunksAbi,
				vm.xDaiPunkAddress
			);

			contract.methods
				.buyPunk(idx)
				.send({
					value: value,
					gasPrice: vm.gasPrice,
					from: window.ethereum.selectedAddress,
				})
				.then((response) => {
					resolve(response);
					console.log(response);
				})
				.catch((responseError) => {
					reject(responseError);
					console.log(responseError);
				});
		});
	}

	mintPunks(number) {
		const vm = this;

		return new Promise((resolve, reject) => {
			let value;
			let contract;

			value = BigNumber(number).times(12).times(1e18).toString();

			contract = new vm.walletProvider.eth.Contract(
				vm.xdaiPunksAbi,
				vm.xDaiPunkAddress
			);

			contract.methods
				.mint(number)
				.send({
					value: value,
					gasPrice: vm.gasPrice,
					from: window.ethereum.selectedAddress,
				})
				.then((response) => {
					resolve(response);
					console.log(response);
				})
				.catch((responseError) => {
					reject(responseError);
					console.log(responseError);
				});
		});
	}

	acceptBidForPunk(idx) {
		const vm = this;

		return new Promise((resolve, reject) => {
			let contract;

			contract = new vm.walletProvider.eth.Contract(
				vm.xdaiPunksAbi,
				vm.xDaiPunkAddress
			);

			contract.methods
				.acceptBidForPunk(idx, 0)
				.send({
					gasPrice: vm.gasPrice,
					from: window.ethereum.selectedAddress,
				})
				.then((response) => {
					resolve(response);
					console.log(response);
				})
				.catch((responseError) => {
					reject(responseError);
					console.log(responseError);
				});
		});
	}

	enterBidForPunk(idx, amount) {
		const vm = this;

		return new Promise((resolve, reject) => {
			let contract;
			const value = BigNumber(amount).times(1e18).toString();

			contract = new vm.walletProvider.eth.Contract(
				vm.xdaiPunksAbi,
				vm.xDaiPunkAddress
			);

			contract.methods
				.enterBidForPunk(idx)
				.send({
					value: value,
					gasPrice: vm.gasPrice,
					from: window.ethereum.selectedAddress,
				})
				.then((response) => {
					resolve(response);
					console.log(response);
				})
				.catch((responseError) => {
					reject(responseError);
					console.log(responseError);
				});
		});
	}

	offerPunkForSale(idx, amount) {
		const vm = this;

		return new Promise((resolve, reject) => {
			let contract;
			const value = BigNumber(amount).times(1e18).toString();

			contract = new vm.walletProvider.eth.Contract(
				vm.xdaiPunksAbi,
				vm.xDaiPunkAddress
			);

			contract.methods
				.offerPunkForSale(idx, value)
				.send({
					gasPrice: vm.gasPrice,
					from: window.ethereum.selectedAddress,
				})
				.then((response) => {
					resolve(response);
					console.log(response);
				})
				.catch((responseError) => {
					reject(responseError);
					console.log(responseError);
				});
		});
	}

	withdrawBidForPunk(idx) {
		const vm = this;

		return new Promise((resolve, reject) => {
			let contract;

			contract = new vm.walletProvider.eth.Contract(
				vm.xdaiPunksAbi,
				vm.xDaiPunkAddress
			);

			contract.methods
				.withdrawBidForPunk(idx)
				.send({
					gasPrice: vm.gasPrice,
					from: window.ethereum.selectedAddress,
				})
				.then((response) => {
					resolve(response);
					console.log(response);
				})
				.catch((responseError) => {
					reject(responseError);
					console.log(responseError);
				});
		});
	}

	punkNoLongerForSale(idx) {
		const vm = this;

		return new Promise((resolve, reject) => {
			let contract;

			contract = new vm.walletProvider.eth.Contract(
				vm.xdaiPunksAbi,
				vm.xDaiPunkAddress
			);

			contract.methods
				.punkNoLongerForSale(idx)
				.send({
					gasPrice: vm.gasPrice,
					from: window.ethereum.selectedAddress,
				})
				.then((response) => {
					resolve(response);
					console.log(response);
				})
				.catch((responseError) => {
					reject(responseError);
					console.log(responseError);
				});
		});
	}

	checkWallet() {
		const vm = this;

		return new Promise((resolve, reject) => {
			let connector;
			let rpcProvider;
			let walletConnect;

			rpcProvider[1337] = configService.web3.httpProvider;

			connector = new WalletConnectProvider({
				rpc: rpcProvider,
			});

			if (connector.connected === true) {
				if (connector.accounts && connector.accounts.length > 0) {
					walletConnect = true;

					vm.walletType = 'wc';
					vm.walletChainId = connector.chainId;

					userService.userSignedIn = true;
					userService.address = connector.accounts[0];

					resolve({ result: 'success' });
				}
			}

			if (walletConnect !== true) {
				if (!window.ethereum) {
					resolve({ result: 'success' });
				} else {
					if (!window.ethereum.selectedAddress) {
						resolve({ result: 'success' });
					} else {
						vm.walletType = 'mm';
						vm.walletChainId = window.ethereum.chainId;

						userService.userSignedIn = true;
						userService.address = window.ethereum.selectedAddress;

						resolve({ result: 'success' });
					}
				}
			}
		});
	}

	connectMetaMask() {
		const vm = this;

		return new Promise((resolve, reject) => {
			let ethereum;

			if (!window.ethereum) {
				reject({ result: 'error', errorType: 'noMetaMask' });
			} else {
				ethereum = window.ethereum;

				window.web3 = new Web3(ethereum);
				vm.walletProvider = window.web3;

				window.ethereum
					.send('eth_requestAccounts')
					.then((response) => {
						vm.walletType = 'mm';
						vm.walletChainId = window.ethereum.chainId;

						userService.userSignedIn = true;
						userService.address = window.ethereum.selectedAddress;

						checkCurrentNetwork();
					})
					.catch((responseError) => {
						reject({
							result: 'error',
							errorType: 'requestAccountsError',
						});
					});
			}

			function checkCurrentNetwork() {
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
							metaMaskaddNewNetwork();
						} else {
							reject({
								result: 'error',
								errorType: 'swicthEthereumChainError',
							});
						}
					});
			}

			function metaMaskaddNewNetwork() {
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

	walletConnectProvider(newId) {
		const rpc = {};
		const url = configService.web3.httpProvider;
		const chainId = configService.web3.xdaiConfig.chainId;

		rpc[chainId] = url;
		if (newId && newId !== chainId) {
			rpc[newId] = url; 
		}
		return new WalletConnectProvider({
			rpc: {
				1337: configService.web3.httpProvider,
			},
		});
	}

	connectWalletConnect() {
		const vm = this;

		return new Promise((resolve, reject) => {
			let provider;

			provider = vm.walletConnectProvider();

			provider
				.enable()
				.then((response) => {
					console.log(response);
					console.log(provider);
					console.log('done');

					vm.walletProvider = new Web3(
						vm.walletConnectProvider(provider.chainId)
					);
				})
				.catch((responseError) => {
					reject({
						result: 'error',
						errorType: 'requestAccountsError',
					});
				});
		});
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

	eventUpdatePunkData(eventData) {
		/*
		event Transfer(
			address indexed from,
			address indexed to,
			uint256 indexed tokenId
		);
		event Approval(
			address indexed owner,
			address indexed approved,
			uint256 indexed tokenId
		);
		event ApprovalForAll(
			address indexed owner,
			address indexed operator,
			bool approved
		);

		event Mint(uint256 indexed index, address indexed minter);
		event PunkOffered(
			uint256 indexed punkIndex,
			uint256 minValue,
			address indexed toAddress
		);
		event PunkBidEntered(
			uint256 indexed punkIndex,
			uint256 value,
			address indexed fromAddress
		);
		event PunkBidWithdrawn(
			uint256 indexed punkIndex,
			uint256 value,
			address indexed fromAddress
		);
		event PunkBought(
			uint256 indexed punkIndex,
			uint256 value,
			address indexed fromAddress,
			address indexed toAddress
		);
		event PunkNoLongerForSale(
			uint256 indexed punkIndex
		);
		*/

		let idx;
		let data;

		let to;
		let from;
		let owner;

		let toAddress;
		let fromAddress;

		let value;
		let minValue;

		let mintsCount;

		const event = eventData.event;
		const blockNumber = eventData.blockNumber;
		const returnValues = eventData.returnValues;

		const punkData = punkService.punkData;

		if (event === 'SaleBegins') {
			punkService.publicSale = true;

			eventService.dispatchObjectEvent('change:punkData', {
				type: 'publicSale',
				publicSale: true,
			});
		}

		if (event === 'Mint') {
			console.log(eventData);
			if (returnValues && returnValues.index) {
				idx = returnValues.index.toString();

				owner = returnValues.minter;

				if (blockNumber >= punkData[idx].blockLatestEvent) {
					punkService.updateItem(idx, 'owner', owner);
					punkService.updateItem(idx, 'mint', true);
					punkService.updateItem(
						idx,
						'blockLatestEvent',
						blockNumber
					);

					mintsCount = punkService.mintsCount;
					punkService.mintsCount = mintsCount + 1;

					console.log('Service mints count', punkService.mintsCount);

					eventService.dispatchObjectEvent('change:punkData', {
						type: 'mint',
						mint: idx,
					});
				}
			}
		}

		if (event === 'PunkOffered') {
			if (returnValues && returnValues.punkIndex) {
				idx = returnValues.punkIndex.toString();

				minValue = returnValues.minValue;
				toAddress = returnValues.toAddress;

				if (blockNumber >= punkData[idx].blockLatestEvent) {
					punkService.updateItem(idx, 'sale', true);
					punkService.updateItem(idx, 'saleData', {
						minValue: minValue,
						toAddress: toAddress,
					});

					punkService.updateItem(
						idx,
						'blockLatestEvent',
						blockNumber
					);

					eventService.dispatchObjectEvent('change:punkData', {
						type: 'punkOffered',
						punkOffered: idx,
					});
				}
			}
		}

		if (event === 'PunkBought') {
			console.log(eventData);

			if (returnValues && returnValues.punkIndex) {
				idx = returnValues.punkIndex.toString();

				value = returnValues.value;
				toAddress = returnValues.toAddress;
				fromAddress = returnValues.fromAddress;

				if (blockNumber >= punkData[idx].blockLatestEvent) {
					punkService.updateItem(idx, 'owner', toAddress);
					punkService.updateItem(idx, 'value', value);
					punkService.updateItem(idx, 'sale', false);
					punkService.updateItem(idx, 'saleData', {});
					punkService.updateItem(
						idx,
						'blockLatestEvent',
						blockNumber
					);

					if (punkData[idx].bid === true) {
						if (
							punkData[idx].bidData &&
							punkData[idx].bidData.fromAddress === toAddress
						) {
							punkService.updateItem(idx, 'bid', false);
							punkService.updateItem(idx, 'bidData', {});
						}
					}

					eventService.dispatchObjectEvent('change:punkData', {
						type: 'PunkBought',
						punkBought: idx,
					});
				}
			}
		}

		if (event === 'PunkBidEntered') {
			console.log(eventData);

			if (returnValues && returnValues.punkIndex) {
				idx = returnValues.punkIndex.toString();

				value = returnValues.value;
				fromAddress = returnValues.fromAddress;

				if (blockNumber >= punkData[idx].blockLatestEvent) {
					punkService.updateItem(idx, 'bid', true);
					punkService.updateItem(idx, 'bidData', {
						value: value,
						fromAddress: fromAddress,
					});
					punkService.updateItem(
						idx,
						'blockLatestEvent',
						blockNumber
					);

					eventService.dispatchObjectEvent('change:punkData', {
						type: 'punkBidEntered',
						punkBidEntered: idx,
					});
				}
			}
		}

		if (event === 'PunkBidWithdrawn') {
			console.log(eventData);

			if (returnValues && returnValues.punkIndex) {
				idx = returnValues.punkIndex.toString();

				value = returnValues.value;
				fromAddress = returnValues.fromAddress;

				if (blockNumber >= punkData[idx].blockLatestEvent) {
					if (punkData[idx].bid === true) {
						if (
							punkData[idx].bidData &&
							punkData[idx].bidData.fromAddress === fromAddress
						) {
							punkService.updateItem(idx, 'bid', false);
							punkService.updateItem(idx, 'bidData', {});
							punkService.updateItem(
								idx,
								'blockLatestEvent',
								blockNumber
							);

							eventService.dispatchObjectEvent(
								'change:punkData',
								{
									type: 'punkBidWithdrawn',
									punkBidWithdrawn: idx,
								}
							);
						}
					}
				}
			}
		}

		if (event === 'PunkNoLongerForSale') {
			console.log(eventData);
			if (returnValues && returnValues.punkIndex) {
				idx = returnValues.punkIndex.toString();

				minValue = returnValues.minValue;
				toAddress = returnValues.toAddress;

				if (blockNumber >= punkData[idx].blockLatestEvent) {
					punkService.updateItem(idx, 'sale', false);
					punkService.updateItem(idx, 'saleData', {});
					punkService.updateItem(
						idx,
						'blockLatestEvent',
						blockNumber
					);

					eventService.dispatchObjectEvent('change:punkData', {
						type: 'punkNoLongerForSale',
						punkNoLongerForSale: idx,
					});
				}
			}
		}
	}

	initializeContractEvents() {
		const vm = this;

		vm.contract.events
			.allEvents()
			.on('connected', (subscriptionId) => {
				console.log(subscriptionId);
			})
			.on('data', (event) => {
				vm.eventUpdatePunkData(event);
			})
			.on('changed', (event) => {
				console.log(event);
			})
			.on('error', (error, receipt) => {
				// Check the error event to restart the socket
				console.log(error, receipt);

				setTimeout(() => {
					vm.setContract();
					vm.initializeContractEvents();
				}, 5000);
			});
	}
}

export default Web3Service;
