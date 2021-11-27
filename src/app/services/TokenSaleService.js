let Instance;

class TokenSaleService {
	constructor() {
		if (!Instance) {
			Instance = this;

			Instance.raisedStore = '0';
			Instance.contributionStore = '0';
		}

		return Instance;
	}

	get raised() {
		const vm = this;
		return vm.raisedStore;
	}

	get contribution() {
		const vm = this;
		return vm.contributionStore;
	}

	set raised(amount) {
		const vm = this;
		vm.raisedStore = amount;
	}

	set contribution(amount) {
        console.log(amount);
		const vm = this;
		vm.contributionStore = amount;
	}
}

export default TokenSaleService;
