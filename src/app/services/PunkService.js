import { punks } from 'src/app/data/punks';

import EventService from 'src/app/services/EventService';
import ConfigService from 'src/app/services/ConfigService';
import ServerService from 'src/app/services/ServerService';
import UtilityService from 'src/app/services/UtilityService';

let Instance;

const eventService = new EventService();
const configService = new ConfigService();
const serverService = new ServerService();
const utilityService = new UtilityService();

class PunkService {
	constructor() {
		if (!Instance) {
			Instance = this;
			Instance.publicSaleStore = null;
			Instance.mintsCountStore = null;

			Instance.punkArrayData = null;
			Instance.punkObjectData = null;

			Instance.generateInitialPunkData();
		}
		return Instance;
	}

	get punkData() {
		const vm = this;
		return vm.punkArrayData;
	}

	set punkData(array) {
		const vm = this;
		vm.punkArrayData = array;
	}

	get punkObject() {
		const vm = this;
		return vm.punkObjectData;
	}

	set punkObject(object) {
		const vm = this;
		vm.punkObjectData = object;
	}

	get mintsCount() {
		const vm = this;
		return vm.mintsCountStore;
	}

	set mintsCount(number) {
		const vm = this;
		vm.mintsCountStore = number;
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

	generatePunkData(remotePunkObject) {
		let punk;
		let keyProp;

		const vm = this;
		const punkObject = vm.punkObject;

		for (punk in remotePunkObject) {
			for (keyProp in remotePunkObject[punk]) {
				punkObject[punk][keyProp] = remotePunkObject[punk][keyProp];
			}
		}

		vm.punkObject = punkObject;
		vm.punkData = utilityService.punkArrayFromObject(vm.punkObject);

		console.log(vm.punkObject['0']);
		window.localStorage.setItem(
			'punks',
			utilityService.generateString(vm.punkObjectData)
		);
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
