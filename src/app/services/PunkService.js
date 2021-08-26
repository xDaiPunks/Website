import { punks } from 'src/app/data/punks';

import ConfigService from 'src/app/services/ConfigService';
import ServerService from 'src/app/services/ServerService';
import UtilityService from 'src/app/services/UtilityService';

let Instance;

const configService = new ConfigService();
const serverService = new ServerService();
const utilityService = new UtilityService();

class PunkService {
	constructor() {
		if (!Instance) {
			Instance = this;
			Instance.publicSale = null;
			Instance.mintsCount = null;

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

	get punkObject() {
		const vm = this;
		return vm.punkObjectData;
	}

	set punkData(array) {
		const vm = this;
		vm.punkArrayData = array;
	}

	set punkObject(object) {
		const vm = this;
		vm.punkObjectData = object;
	}

	generateArray(object) {
		let key;
		const array = [];

		for (key in object) {
			array.push(object[key]);
		}

		return array;
	}

	generateObject(array) {
		let i;
		let iCount;

		const object = {};

		for (i = 0, iCount = array.length; i < iCount; i++) {
			object['#' + array[i].idx] = punks[i];
		}

		return object;
	}

	generateInitialPunkData() {
		let i;
		let iCount;

		const vm = this;

		vm.punkArrayData = punks;

		vm.punkObjectData = {};
		for (i = 0, iCount = punks.length; i < iCount; i++) {
			vm.punkObjectData['#' + punks[i].idx] = punks[i];
		}
	}
}

export default PunkService;
