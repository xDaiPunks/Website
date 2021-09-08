/* eslint-disable no-unused-vars */

import axios from 'axios';

import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/ethereum-provider';

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

			Instance.provider = null;
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

		const web3Socket = new Web3(
			new Web3.providers.WebsocketProvider(vm.socketProvider, {
				clientConfig: {
					maxReceivedFrameSize: 20000000000,
					maxReceivedMessageSize: 20000000000,
				},
			})
		);

		vm.web3 = web3;
		web3.eth.Contract.setProvider(web3Socket.currentProvider);

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

	checkCall() {
		const vm = this;

		const userSignedIn = userService.userSignedIn;

		if (userSignedIn !== true) {
			eventService.dispatchObjectEvent('show:modal', {
				type: 'walletModal',
			});
			return false;
		} else {
			if (!vm.walletChainId) {
				eventService.dispatchObjectEvent('show:modal', {
					type: 'alertModal',
					header: 'Wrong chain',
					content: 'Please switch to the xDai chain in your wallet',
					buttonText: 'Ok',
				});
				return false;
			} else {
				if (
					vm.walletChainId === configService.web3.xdaiConfig.chainId
				) {
					return true;
				} else {
					if (
						parseInt(vm.walletChainId) ===
						configService.web3.xdaiConfig.chainId
					) {
						return true;
					} else {
						if (
							vm.walletChainId ===
							parseInt(configService.web3.xdaiConfig.chainId)
						) {
							return true;
						} else {
							if (
								parseInt(vm.walletChainId) ===
								parseInt(configService.web3.xdaiConfig.chainId)
							) {
								return true;
							} else {
								eventService.dispatchObjectEvent('show:modal', {
									type: 'alertModal',
									header: 'Wrong chain',
									content:
										'Please switch to the xDai chain in your wallet',
									buttonText: 'Ok',
								});
								return false;
							}
						}
					}
				}
			}
		}
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

	getIdx(id) {
		let idx;
		idx = id.toString();

		if (idx === '0') {
			idx = '10000';
		}

		return idx;
	}

	checkBlockNumber(idx, eventType, blockNumber) {
		const punkData = punkService.punkData;

		if (eventType !== 'bid') {
			if (blockNumber >= punkData[idx].blockLatestEvent) {
				return true;
			} else {
				return false;
			}
		} else {
			if (blockNumber >= punkData[idx].blockLatestEventBid) {
				return true;
			} else {
				return false;
			}
		}
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

			if (vm.checkCall() !== true) {
				return reject({ result: 'error', errorType: 'chainId' });
			}

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
				})
				.catch((responseError) => {
					reject(responseError);
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

	buyPunk(idx, amount) {
		const vm = this;

		return new Promise((resolve, reject) => {
			let contract;
			const value = BigNumber(amount).times(1e18).toFixed();

			if (vm.checkCall() !== true) {
				return reject({ result: 'error', errorType: 'chainId' });
			}

			idx = vm.getIdx(idx);

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
				})
				.catch((responseError) => {
					reject(responseError);
				});
		});
	}

	mintPunks(number) {
		const vm = this;

		return new Promise((resolve, reject) => {
			let value;
			let contract;

			if (vm.checkCall() !== true) {
				return reject({ result: 'error', errorType: 'chainId' });
			}

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
				})
				.catch((responseError) => {
					reject(responseError);
				});
		});
	}

	acceptBidForPunk(idx) {
		const vm = this;

		return new Promise((resolve, reject) => {
			let contract;

			if (vm.checkCall() !== true) {
				return reject({ result: 'error', errorType: 'chainId' });
			}

			idx = vm.getIdx(idx);

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
				})
				.catch((responseError) => {
					reject(responseError);
				});
		});
	}

	enterBidForPunk(idx, amount) {
		const vm = this;

		return new Promise((resolve, reject) => {
			let contract;
			const value = BigNumber(amount).times(1e18).toFixed();

			if (vm.checkCall() !== true) {
				return reject({ result: 'error', errorType: 'chainId' });
			}

			idx = vm.getIdx(idx);

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
				})
				.catch((responseError) => {
					reject(responseError);
				});
		});
	}

	offerPunkForSale(idx, amount) {
		const vm = this;

		return new Promise((resolve, reject) => {
			let contract;
			const value = BigNumber(amount).times(1e18).toFixed();

			if (vm.checkCall() !== true) {
				return reject({ result: 'error', errorType: 'chainId' });
			}

			idx = vm.getIdx(idx);

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
				})
				.catch((responseError) => {
					reject(responseError);
				});
		});
	}

	withdrawBidForPunk(idx) {
		const vm = this;

		return new Promise((resolve, reject) => {
			let contract;

			if (vm.checkCall() !== true) {
				return reject({ result: 'error', errorType: 'chainId' });
			}

			idx = vm.getIdx(idx);

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
				})
				.catch((responseError) => {
					reject(responseError);
				});
		});
	}

	punkNoLongerForSale(idx) {
		const vm = this;

		return new Promise((resolve, reject) => {
			let contract;

			if (vm.checkCall() !== true) {
				return reject({ result: 'error', errorType: 'chainId' });
			}

			idx = vm.getIdx(idx);

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
				})
				.catch((responseError) => {
					reject(responseError);
				});
		});
	}

	disconnectWallet() {
		const vm = this;

		userService.address = null;
		userService.userSignedIn = null;

		if (vm.provider && vm.provider.disconnect) {
			vm.provider.disconnect();
		}

		eventService.dispatchObjectEvent('force:state');
	}

	connectMetaMask() {
		const vm = this;

		return new Promise((resolve, reject) => {
			if (!window.ethereum) {
				reject({ result: 'error', errorType: 'noMetaMask' });
			} else {
				window.ethereum
					.send('eth_requestAccounts')
					.then((response) => {
						vm.provider = window.ethereum;

						vm.walletType = 'mm';
						vm.walletChainId = window.ethereum.chainId;

						userService.userSignedIn = true;
						userService.address = window.ethereum.selectedAddress;

						vm.walletProvider = new Web3(window.ethereum, {
							clientConfig: {
								maxReceivedFrameSize: 200000000, // bytes - default: 1MiB
								maxReceivedMessageSize: 200000000, // bytes - default: 8MiB
							},
						});

						setEvents();
						checkCurrentNetwork();
					})
					.catch((responseError) => {
						reject({
							result: 'error',
							errorType: 'requestAccountsError',
						});
					});
			}

			function setEvents() {
				vm.walletProvider = new Web3(window.ethereum);

				window.ethereum.on('disconnect', (accountArray) => {
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
							userService.address =
								window.ethereum.selectedAddress;

							punkService.setPunkDetails();
						}

						eventService.dispatchObjectEvent('force:state');
						eventService.dispatchObjectEvent('hide:preloader');
					});

					eventService.dispatchObjectEvent('show:preloader');
				});

				window.ethereum.on('connect', (event) => {});

				window.ethereum.on('chainChanged', (event) => {
					vm.walletType = 'mm';
					vm.walletChainId = window.ethereum.chainId;
				});

				window.ethereum.on('accountsChanged', (accountArray) => {
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
			}

			function checkCurrentNetwork() {
				const xdaiConfig = configService.web3.xdaiConfig;

				window.ethereum
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
				window.ethereum
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
			let provider;
			let httpProvider;

			const web3Config = configService.web3;

			rpc = {};

			xdai = web3Config.xdaiConfig;
			chainId = xdai.chainId;
			httpProvider = web3Config.httpProvider;

			rpc[chainId] = httpProvider;

			rpc[1] = 'https://cloudflare-eth.com';
			rpc[10] = 'https://mainnet.optimism.io';
			rpc[100] = 'https://rpc.xdaichain.com/';
			rpc[56] = 'https://bsc-dataseed.binance.org/';
			rpc[137] = 'https://rpc-mainnet.maticvigil.com/';
			rpc[42161] =
				'https://arbitrum-mainnet.infura.io/v3/93a1c93e80c44e55838a599056b3a9ec';

			//test urls
			rpc[3] =
				'https://ropsten.infura.io/v3/93a1c93e80c44e55838a599056b3a9ec';
			rpc[4] =
				'https://rinkeby.infura.io/v3/93a1c93e80c44e55838a599056b3a9ec';
			rpc[5] =
				'https://goerli.infura.io/v3/93a1c93e80c44e55838a599056b3a9ec';
			rpc[42] =
				'https://kovan.infura.io/v3/93a1c93e80c44e55838a599056b3a9ec';

			provider = new WalletConnectProvider({
				rpc: rpc,
				// infuraId: '93a1c93e80c44e55838a599056b3a9ec',
				chainId: chainId,
				network: 'xDai',
				qrcode: true,
				qrcodeModalOptions: {
					mobileLinks: ['metamask', 'pillar'],
				},
			});

			provider.networkId = chainId;

			vm.provider = provider;

			provider
				.enable()
				.then((response) => {
					vm.walletType = 'wc';
					vm.walletChainId = provider.chainId;

					userService.userSignedIn = true;
					userService.address = provider.accounts[0];

					vm.walletProvider = new Web3(provider);

					setEvents();
					resolve({ result: 'success' });
				})
				.catch((responseError) => {
					reject({
						result: 'error',
						errorType: 'walletConnectProviderError',
					});
				});

			function setEvents() {
				provider.on('accountsChanged', (accounts) => {
					vm.walletType = 'wc';
					vm.walletChainId = provider.chainId;

					userService.userSignedIn = true;
					userService.address = provider.accounts[0];

					eventService.off('preloader:show', vm.guid);
					eventService.on('preloader:show', vm.guid, () => {
						eventService.off('preloader:show', vm.guid);

						vm.walletType = 'wc';
						vm.walletChainId = provider.chainId;

						userService.userSignedIn = true;
						userService.address = provider.accounts[0];

						punkService.setPunkDetails();

						eventService.dispatchObjectEvent('force:state');
						eventService.dispatchObjectEvent('hide:preloader');
					});

					eventService.dispatchObjectEvent('show:preloader');
				});

				// Subscribe to chainId change
				provider.on('chainChanged', (chainId) => {
					vm.walletType = 'wc';
					vm.walletChainId = chainId;
				});

				// Subscribe to session disconnection
				provider.on('disconnect', (code, reason) => {
					eventService.off('preloader:show', vm.guid);
					eventService.on('preloader:show', vm.guid, () => {
						eventService.off('preloader:show', vm.guid);

						vm.walletType = 'wc';
						vm.walletChainId = provider.chainId;

						punkService.setPunkDetails();

						eventService.dispatchObjectEvent('force:state');
						eventService.dispatchObjectEvent('hide:preloader');
					});

					eventService.dispatchObjectEvent('show:preloader');
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

		let owner;

		let eventType;

		let toAddress;
		let fromAddress;

		let value;
		let minValue;

		let mintsCount;

		const vm = this;

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
			if (returnValues && returnValues.index) {
				idx = returnValues.index.toString();

				owner = returnValues.minter;

				eventType = 'mint';
				if (vm.checkBlockNumber(idx, eventType, blockNumber) === true) {
					punkService.updateItem(idx, 'owner', owner);
					punkService.updateItem(idx, 'mint', true);
					punkService.updateItem(
						idx,
						'blockLatestEvent',
						blockNumber
					);

					mintsCount = punkService.mintsCount;
					punkService.mintsCount = mintsCount + 1;

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

				eventType = 'sale';
				if (vm.checkBlockNumber(idx, eventType, blockNumber) === true) {
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
			if (returnValues && returnValues.punkIndex) {
				idx = returnValues.punkIndex.toString();

				value = returnValues.value;
				toAddress = returnValues.toAddress;
				fromAddress = returnValues.fromAddress;

				eventType = 'sale';
				if (vm.checkBlockNumber(idx, eventType, blockNumber) === true) {
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
							eventType = 'bid';
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
			if (returnValues && returnValues.punkIndex) {
				idx = returnValues.punkIndex.toString();

				value = returnValues.value;
				fromAddress = returnValues.fromAddress;

				eventType = 'bid';
				if (vm.checkBlockNumber(idx, eventType, blockNumber) === true) {
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
			if (returnValues && returnValues.punkIndex) {
				idx = returnValues.punkIndex.toString();

				value = returnValues.value;
				fromAddress = returnValues.fromAddress;

				eventType = 'bid';
				if (vm.checkBlockNumber(idx, eventType, blockNumber) === true) {
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
			if (returnValues && returnValues.punkIndex) {
				idx = returnValues.punkIndex.toString();

				minValue = returnValues.minValue;
				toAddress = returnValues.toAddress;

				eventType = 'sale';
				if (vm.checkBlockNumber(idx, eventType, blockNumber) === true) {
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
				console.log('Contract connected');
			})
			.on('data', (event) => {
				vm.eventUpdatePunkData(event);
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
