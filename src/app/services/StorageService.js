let Instance;

class StorageService {
	constructor() {
		if (!Instance) {
			Instance = this;
		}

		return Instance;
	}

	getItem(key) {
		return localStorage.getItem(key);
	}

	setItem(key, value) {
		localStorage.setItem(key, value);
    }
    
    removeItem(key) {
        localStorage.removeItem(key); 
    }
}

export default StorageService;
