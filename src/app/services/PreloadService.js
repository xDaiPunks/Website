import UtilityService from 'src/app/services/UtilityService';

const utilityService = new UtilityService();

class PreloadService {
	constructor() {
		this.imagesArray = [];

		utilityService.addObjectEventDispatcher(this);
	}

	imageCount() {
		return this.imagesArray.length;
	}

	preload(imageUrl, imageElement, imageAttributeType) {
		if (imageUrl && imageUrl !== '') {
			this.imagesArray.push({
				imageUrl: imageUrl,
				imageElement: imageElement,
				imageAttributeType: imageAttributeType,
			});
		}
	}

	runPreloader() {
        let i;

		let loadedImages;
        let loadedImagesArray;
        
        const vm = this;

        loadedImages = 0;
        loadedImagesArray = [];

		if (this.imagesArray.length === 0) {
			vm.imagesArray = [];
			vm.dispatchObjectEvent('preloadReady', {
				success: true,
				imagesArray: [],
			});
			return;
		}

		for (i = 0; i < this.imagesArray.length; i++) {
			loadedImagesArray[i] = new Image();
			loadedImagesArray[i].src = this.imagesArray[i].imageUrl;

			loadedImagesArray[i].onload = function () {
				checkImagesLoaded();
			};
			loadedImagesArray[i].onerror = function () {
				checkImagesLoaded();
			};
		}

		function checkImagesLoaded() {
			loadedImages++;

			if (loadedImages === vm.imagesArray.length) {
				vm.dispatchObjectEvent('preloadReady', {
					success: true,
					imagesArray: vm.imagesArray,
				});
				vm.imagesArray = [];
			}
		}
	}
}

export default PreloadService;
