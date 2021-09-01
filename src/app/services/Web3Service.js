import axios from 'axios';

import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';

import { BigNumber } from 'bignumber.js';

import AbiService from 'src/app/services/AbiService';
import PunkService from 'src/app/services/PunkService';
import UserService from 'src/app/services/UserService';
import EventService from 'src/app/services/EventService';
import ConfigService from 'src/app/services/ConfigService';
import UtilityService from 'src/app/services/UtilityService';

let Instance;

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
		const vm = this;

		metaMaskEvents();
		function metaMaskEvents() {
			if (window.ethereum) {
				vm.walletProvider = new Web3(window.ethereum);

				window.ethereum.on('disconnect', (accountArray) => {
					console.log('disconnect event', accountArray);

					eventService.off('preloader:show', vm.guid);
					eventService.on('preloader:show', vm.guid, () => {
						eventService.off('preloader:show', vm.guid);
						if (accountArray.length === 0) {
							vm.walletType = 'mm';
							vm.walletChainId = window.ethereum.chainId;

							userService.address = null;
							userService.userSignedIn = null;
						} else {
							vm.walletType = 'mm';
							vm.walletChainId = window.ethereum.chainId;

							userService.userSignedIn = true;
							userService.address = accountArray[0];

							punkService.setPunkDetails();
						}

						eventService.dispatchObjectEvent('force:state');
						eventService.dispatchObjectEvent('hide:preloader');
					});

					eventService.dispatchObjectEvent('show:preloader');
				});

				window.ethereum.on('connect', (event) => {
					console.log('connect event', event);
				});

				window.ethereum.on('chainChanged', (event) => {
					console.log('chainChange event', event);
				});

				window.ethereum.on('accountsChanged', (accountArray) => {
					console.log('accountChange event', accountArray);

					eventService.off('preloader:show', vm.guid);
					eventService.on('preloader:show', vm.guid, () => {
						eventService.off('preloader:show', vm.guid);
						if (accountArray.length === 0) {
							vm.walletType = 'mm';
							vm.walletChainId = window.ethereum.chainId;

							userService.address = null;
							userService.userSignedIn = null;
						} else {
							vm.walletType = 'mm';
							vm.walletChainId = window.ethereum.chainId;

							userService.address = accountArray[0];
							userService.userSignedIn = true;

							punkService.setPunkDetails();
						}

						eventService.dispatchObjectEvent('force:state');
						eventService.dispatchObjectEvent('hide:preloader');
					});

					eventService.dispatchObjectEvent('show:preloader');
				});

				return true;
			} else {
				return false;
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
					punkService.publicSale = false;
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
					punkService.mintsCount = 0;
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
					from: userService.address,
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
					from: userService.address,
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
					from: userService.address,
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
					from: userService.address,
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
					from: userService.address,
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
					from: userService.address,
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
					from: userService.address,
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
					from: userService.address,
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


	connectMetaMask() {
		const vm = this;

		return new Promise((resolve, reject) => {
			let ethereum;

			if (!window.ethereum) {
				reject({ result: 'error', errorType: 'noMetaMask' });
			} else {
				ethereum = window.ethereum;

				vm.walletProvider = new Web3(ethereum);

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

	connectWalletConnect() {
		const vm = this;

		return new Promise((resolve, reject) => {
			let rpc;
			let xdai;
			let chainId;
			let httpProvider;

			const web3Config = configService.web3;

			rpc = {};

			xdai = web3Config.xdaiConfig;
			chainId = xdai.chainId;
			httpProvider = web3Config.httpProvider;

			rpc[chainId] = httpProvider;

			rpc[1] = 'https://cloudflare-eth.com';
			rpc[100] = 'https://rpc.xdaichain.com/';

			const provider = new WalletConnectProvider({
				rpc: rpc,
				infuraId: '93a1c93e80c44e55838a599056b3a9ec',
				chainId: chainId,
				network: 'xDai',
				qrcode: true,
				qrcodeModalOptions: {
					mobileLinks: ['metamask', 'pillar'],
				},
			});

			provider.networkId = chainId;

			provider
				.enable()
				.then((response) => {
					console.log(response);
					console.log(provider);

					vm.walletType = 'wc';
					vm.walletChainId = provider.chainId;

					userService.userSignedIn = true;
					userService.address = provider.accounts[0];

					vm.walletProvider = new Web3(provider);
					resolve({ result: 'success' });
				})
				.catch((responseError) => {
					console.log(responseError);
					reject({
						result: 'error',
						errorType: 'walletConnectProviderError',
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
						idx: idx,
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
						idx: idx,
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
						idx: idx,
						toAddress: toAddress,
						fromAddress: fromAddress,
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
						idx: idx,
						fromAddress: fromAddress,
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
									idx: idx,
									fromAddress: fromAddress,
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
						idx: idx,
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
				console.log('Contract websocket id', subscriptionId);
			})
			.on('data', (event) => {
				console.log('Contract websocket data event', event);
				vm.eventUpdatePunkData(event);
			})
			.on('changed', (event) => {
				console.log('Contract websocket changed event', event);
			})
			.on('error', (error, receipt) => {
				// Check the error event to restart the socket
				console.log('Reconnecting..');

				vm.setContract();
				vm.initializeContractEvents();
			});
	}
}

export default Web3Service;
