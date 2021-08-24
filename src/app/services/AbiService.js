/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-lonely-if */
/* eslint-disable arrow-body-style */
/* eslint-disable array-callback-return */

import { sha3, BN } from 'web3-utils';
import abiCoder from 'web3-eth-abi';

let Instance;

class AbiService {
	constructor() {
		if (!Instance) {
			Instance = this;

			Instance.BN = BN;
			Instance.sha3 = sha3;
			Instance.abiCoder = abiCoder;

			Instance.state = {
				savedABIs: [],
				methodIDs: {},
			};
		}

		return Instance;
	}

	getABIs() {
		const vm = this;
		return vm.state.savedABIs;
	}

	typeToString(input) {
		const vm = this;
		if (input.type === 'tuple') {
			return '(' + input.components.map(vm.typeToString).join(',') + ')';
		}
		return input.type;
	}

	addABI(abiArray) {
		const vm = this;

		if (Array.isArray(abiArray)) {
			// Iterate new abi to generate method id"s
			abiArray.map((abi) => {
				let signature;

				if (abi.name) {
					signature = vm.sha3(
						abi.name +
							'(' +
							abi.inputs.map(vm.typeToString).join(',') +
							')'
					);
					if (abi.type === 'event') {
						vm.state.methodIDs[signature.slice(2)] = abi;
					} else {
						vm.state.methodIDs[signature.slice(2, 10)] = abi;
					}
				}
			});

			vm.state.savedABIs = vm.state.savedABIs.concat(abiArray);
		} else {
			throw new Error('Expected ABI array, got ' + typeof abiArray);
		}
	}

	removeABI(abiArray) {
		const vm = this;
		if (Array.isArray(abiArray)) {
			abiArray.map((abi) => {
				let signature;
				if (abi.name) {
					signature = vm.sha3(
						abi.name +
							'(' +
							abi.inputs
								.map((input) => {
									return input.type;
								})
								.join(',') +
							')'
					);
					if (abi.type === 'event') {
						if (vm.state.methodIDs[signature.slice(2)]) {
							delete vm.state.methodIDs[signature.slice(2)];
						}
					} else {
						if (vm.state.methodIDs[signature.slice(2, 10)]) {
							delete vm.state.methodIDs[signature.slice(2, 10)];
						}
					}
				}
			});
		} else {
			throw new Error('Expected ABI array, got ' + typeof abiArray);
		}
	}

	getMethodIDs() {
		const vm = this;
		return vm.state.methodIDs;
	}

	decodeMethod(data) {
		let i;
		let iCount;

		let param;
		let parsedParam;

		let decoded;
		let retData;

		const vm = this;
		const methodID = data.slice(2, 10);
		const abiItem = vm.state.methodIDs[methodID];

		if (abiItem) {
			retData = {
				name: abiItem.name,
				params: [],
			};

			decoded = vm.abiCoder.decodeParameters(
				abiItem.inputs,
				data.slice(10)
			);
			iCount = decoded.__length__;

			for (i = 0; i < iCount; i++) {
				param = decoded[i];
				parsedParam = param;

				const isUint = abiItem.inputs[i].type.indexOf('uint') === 0;
				const isInt = abiItem.inputs[i].type.indexOf('int') === 0;
				const isAddress =
					abiItem.inputs[i].type.indexOf('address') === 0;

				if (isUint || isInt) {
					const isArray = Array.isArray(param);

					if (isArray) {
						parsedParam = param.map((val) =>
							new vm.BN(val).toString()
						);
					} else {
						parsedParam = new vm.BN(param).toString();
					}
				}

				if (isAddress) {
					const isArray = Array.isArray(param);

					if (isArray) {
						parsedParam = param.map((_) => _.toLowerCase());
					} else {
						parsedParam = param.toLowerCase();
					}
				}

				retData.params.push({
					name: abiItem.inputs[i].name,
					value: parsedParam,
					type: abiItem.inputs[i].type,
				});
			}

			return retData;
		}
	}

	decodeLogs(logs) {
		const vm = this;

		return logs
			.filter((log) => log.topics.length > 0)
			.map((logItem) => {
				let logData;
				let dataTypes;

				let dataIndex;
				let topicsIndex;

				let decodedData;

				let decodedParams;

				const methodID = logItem.topics[0].slice(2);
				const method = vm.state.methodIDs[methodID];

				if (method) {
					logData = logItem.data;

					dataIndex = 0;
					topicsIndex = 1;

					dataTypes = [];
					decodedParams = [];

					method.inputs.map((input) => {
						if (!input.indexed) {
							dataTypes.push(input.type);
						}
					});

					decodedData = vm.abiCoder.decodeParameters(
						dataTypes,
						logData.slice(2)
					);

					// Loop topic and data to get the params
					method.inputs.map((param) => {
						let temp;
						let toRemove;

						const decodedP = {
							name: param.name,
							type: param.type,
						};

						if (param.indexed) {
							decodedP.value = logItem.topics[topicsIndex];
							topicsIndex++;
						} else {
							decodedP.value = decodedData[dataIndex];
							dataIndex++;
						}

						if (param.type === 'address') {
							decodedP.value = decodedP.value.toLowerCase();
							// 42 because len(0x) + 40
							if (decodedP.value.length > 42) {
								toRemove = decodedP.value.length - 42;
								temp = decodedP.value.split('');
								temp.splice(2, toRemove);
								decodedP.value = temp.join('');
							}
						}

						if (
							param.type === 'uint256' ||
							param.type === 'uint8' ||
							param.type === 'int'
						) {
							if (
								typeof decodedP.value === 'string' &&
								decodedP.value.startsWith('0x')
							) {
								decodedP.value = new vm.BN(
									decodedP.value.slice(2),
									16
								).toString(10);
							} else {
								decodedP.value = new vm.BN(
									decodedP.value
								).toString(10);
							}
						}

						decodedParams.push(decodedP);
					});

					return {
						name: method.name,
						events: decodedParams,
						address: logItem.address,
					};
				}
			});
	}
}

export default AbiService;
