/* eslint-disable no-unused-vars */
import { punks } from 'src/app/data/punks';

import UserService from 'src/app/services/UserService';
import EventService from 'src/app/services/EventService';
import ConfigService from 'src/app/services/ConfigService';
import ServerService from 'src/app/services/ServerService';
import UtilityService from 'src/app/services/UtilityService';

let Instance;

const userService = new UserService();
const eventService = new EventService();
const configService = new ConfigService();
const serverService = new ServerService();
const utilityService = new UtilityService();

class PunkService {
	constructor() {
		if (!Instance) {
			Instance = this;

			Instance.bidStore = null;
			Instance.saleStore = null;
			Instance.ownedStore = null;

			Instance.publicSaleStore = null;
			Instance.mintsCountStore = null;

			Instance.punkArrayData = null;
			Instance.punkObjectData = null;

			Instance.generateInitialPunkData();
		}
		return Instance;
	}

	get bids() {
		const vm = this;
		return vm.bidStore;
	}

	set bids(internalObject) {
		const vm = this;
		vm.bidStore = internalObject;
	}

	get owned() {
		const vm = this;
		return vm.ownedStore;
	}

	set owned(internalObject) {
		const vm = this;
		vm.ownedStore = internalObject;
	}

	get punkData() {
		const vm = this;
		return vm.punkArrayData;
	}

	set punkData(internalArray) {
		const vm = this;
		vm.punkArrayData = internalArray;
	}

	get punkObject() {
		const vm = this;
		return vm.punkObjectData;
	}

	set punkObject(internalObject) {
		const vm = this;
		vm.punkObjectData = internalObject;
	}

	get mintsCount() {
		const vm = this;
		return vm.mintsCountStore;
	}

	set mintsCount(internalNumber) {
		const vm = this;
		vm.mintsCountStore = internalNumber;
	}

	get publicSale() {
		const vm = this;
		return vm.publicSaleStore;
	}

	set publicSale(bool) {
		const vm = this;
		vm.publicSaleStore = bool;
	}

	getItem(idx) {
		const vm = this;
		return vm.punkObjectData[idx];
	}

	updateItem(idx, key, data) {
		const vm = this;
		if (vm.punkObjectData) {
			vm.punkObjectData[idx][key] = data;
		}
	}

	setPunkDetails() {
		let i;
		let iCount;

		let address;

		const vm = this;

		const bidObject = {};
		const saleObject = {};
		const ownedObject = {};

		const punkData = vm.punkData;

		if (userService.userSignedIn === true) {
			address = userService.address.toLowerCase();
			for (i = 0, iCount = punkData.length; i < iCount; i++) {
				if (address === punkData[i].owner.toLowerCase()) {
					ownedObject[punkData[i].idx] = {
						idx: punkData[i].idx,
					};
				}

				if (punkData[i].bid === true) {
					if (
						punkData[i].bidData &&
						punkData[i].bidData.fromAddress
					) {
						if (
							address ===
							punkData[i].bidData.fromAddress.toLowerCase()
						) {
							bidObject[punkData[i].idx] = {
								idx: punkData[i].idx,
								bidData: punkData[i].bidData,
							};
						}
					}
				}

				if (punkData[i].sale === true) {
					if (punkData[i].saleData) {
						if (address === punkData[i].owner.toLowerCase()) {
							saleObject[punkData[i].idx] = {
								idx: punkData[i].idx,
								saleData: punkData[i].saleObject,
							};
						}
					}
				}
			}
		}

		// console.log('BIDS', bidObject);
		// console.log('SALE', saleObject);
		// console.log('OWNED', ownedObject);

		vm.bids = bidObject;
		vm.sale = saleObject;
		vm.owned = ownedObject;
	}

	generateObject(punkArray) {
		let i;
		let iCount;

		const punkObject = {};

		for (i = 0, iCount = punkArray.length; i < iCount; i++) {
			punkObject[punkArray[i].idx] = punkArray[i];
		}

		return punkObject;
	}

	generatePunkData(remotePunkObject) {
		let punk;
		let keyProp;

		const vm = this;
		const punkObject = vm.punkObject;

		if (!remotePunkObject) {
			remotePunkObject = vm.generateObject(punks);
		}

		for (punk in remotePunkObject) {
			for (keyProp in remotePunkObject[punk]) {
				punkObject[punk][keyProp] = remotePunkObject[punk][keyProp];
			}
		}

		vm.punkObject = punkObject;
		vm.punkData = utilityService.punkArrayFromObject(vm.punkObject);
	}

	generateInitialPunkData() {
		let i;
		let iCount;

		let punkData = [];
		let punkObject = {};

		const vm = this;

		for (i = 0, iCount = punks.length; i < iCount; i++) {
			punkData[i] = punks[i];
			punkObject[punkData[i].idx] = punks[i];
		}

		vm.punkData = punkData;
		vm.punkObject = punkObject;
	}
}

export default PunkService;
