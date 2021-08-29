import axios from 'axios';

import Web3 from 'web3';
import { BigNumber } from 'bignumber.js';

import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';

import AbiService from 'src/app/services/AbiService';
import PunkService from 'src/app/services/PunkService';
import UserService from 'src/app/services/UserService';
import EventService from 'src/app/services/EventService';
import ConfigService from 'src/app/services/ConfigService';
import UtilityService from 'src/app/services/UtilityService';

let Instance;
let xDaiPunksAddress;

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

			Instance.walletSigner = null;
			Instance.walletChainId = null;
			Instance.walletProvider = null;
			Instance.walletConnector = null;
			Instance.walletConnectorType = null; // mm or wc

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

	mintPunks(number) {
		const vm = this;

		return new Promise((resolve, reject) => {
			let value;
			let contract;

			value = BigNumber(number).times(12).times(1e18).toString();

			contract = new window.web3.eth.Contract(
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

				window.web3 = new Web3(ethereum);

				window.ethereum
					.send('eth_requestAccounts')
					.then((response) => {
						console.log(response);
						userService.address = window.ethereum.selectedAddress;
						userService.userSignedIn = true;

						checkCurrentNetwork(signer, userService.address);
						//signer = provider.getSigner();
						//getSignerAddress(signer, provider);
					})
					.catch((responseError) => {
						console.log(responseError);
						reject({
							result: 'error',
							errorType: 'requestAccountsError',
						});
					});
			}

			function checkCurrentNetwork(signer, signerAddress) {
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

	/*

	addABI() {
		abiService.addABI(xDaiPunksAbi);
	}

	addAddress() {
		xDaiPunksAddress = configService.web3.xDaiPunksAddress;
	}

	addProvider() {
		const vm = this;

	
		vm.provider = new ethers.providers.JsonRpcProvider({
			url: configService.web3.httpProvider,
		});
	
	}

	addContract() {
		const vm = this;
	
		vm.contract = new ethers.Contract(
			xDaiPunksAddress,
			xDaiPunksAbi,
			vm.provider
		);
	
	}

	addContractEvents() {
		const vm = this;
	
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

		vm.contract.on('Transfer', transferListener);
		vm.contract.on('Approval', approvalListener);
		vm.contract.on('ApprovalForAll', approvalForAllListener);

		vm.contract.on('SaleBegins', saleBeginsListener);

		vm.contract.on('Mint', mintListener);
		vm.contract.on('PunkBought', punkBoughtListener);
		vm.contract.on('PunkOffered', punkOfferedListener);
		vm.contract.on('PunkBidEntered', punkBidEnteredListener);
		vm.contract.on('PunkBidWithdrawn', punkBidWithdrawnListener);
		vm.contract.on('PunkNoLongerForSale', punkNoLongerForSaleListener);

		function transferListener(from, to, idx) {
			console.log(from, to, idx.toString());
		}

		function approvalListener(owner, approved, idx) {
			console.log(owner, approved, idx.toString());
		}

		function approvalForAllListener(owner, operator, approved) {
			console.log(owner, operator, approved);
		}

		function saleBeginsListener() {
			console.log('sale started');
		}

		function mintListener(idx, address) {
			console.log(idx.toString(), address);
		}

		function punkBoughtListener(idx, value, from, to) {
			console.log(idx.toString(), value.toString(), from, to);
		}

		function punkOfferedListener(idx, value, address) {
			console.log(idx.toString(), value.toString(), address);
		}

		function punkBidEnteredListener(idx, value, address) {
			console.log(idx.toString(), value.toString(), address);
		}

		function punkBidWithdrawnListener(idx, value, address) {
			console.log(idx.toString(), value.toString(), address);
		}

		function punkNoLongerForSaleListener(idx) {
			console.log(idx.toString());
		}
	
	}

	isAddress(address) {
		//return ethers.utils.isAddress(address);
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
						userService.userSignedIn = null;
					} else {
						userService.address = accountArray[0];
						userService.userSignedIn = true;
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
						userService.userSignedIn = null;
					} else {
						userService.address = accountArray[0];
						userService.userSignedIn = true;
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
						userService.userSignedIn = true;

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

						userService.address = signerResponse;
						userService.userSignedIn = true;
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

		//return ethers.utils.parseUnits(value, unit);
	}

	formatNumber(value, unit) {
		if (!unit) {
			unit = 'ether';
		}

		//return ethers.utils.formatUnits(value, unit);
	}

	convertKeccak256(string) {
		//return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(string));
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


	checkWeb3() {
		const vm = this;

		return new Promise((resolve, reject) => {
			let connector;

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
						userService.address = null;
						userService.userSignedIn = null;

						resolve({ result: 'success' });
					} else {
						userService.address = ethereum.selectedAddress;
						userService.userSignedIn = true;
						resolve({ result: 'success' });
					}
				}
			}

			

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

	publicSale() {
		const vm = this;

		return new Promise((resolve, reject) => {
			vm.contract
				.publicSale()

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
			vm.contract
				.mintsRemaining()

				.then((mintsRemaining) => {
					let mintsCount;

					mintsCount = BigNumber(10000)
						.minus(BigNumber(mintsRemaining.toString()))
						.toString();

					punkService.mintsCount = mintsCount;
					resolve(mintsRemaining);
				})
				.catch((mintsRemainingError) => {
					reject(mintsRemainingError);
				});
		});
	}
	*/
}

export default Web3Service;
