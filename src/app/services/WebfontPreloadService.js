import UtilityService from 'src/app/services/UtilityService';

const utilityService = new UtilityService();

class WebfontPreloadService {
	constructor() {
		this.preloadItems = 0;

		this.preloadComplete = false;
		this.preloadRunning = false;

		this.preloadTimeout = null;
		this.preloadInterval = null;
		this.preloadElement = null;

		utilityService.addObjectEventDispatcher(this);
	}

	timeoutCheck() {
		this.preloadComplete = true;
		this.dispatchObjectEvent('preloadReady', {
			success: false,
			error: 'couldNotLoadAllFontsFaces',
		});
		this.cleanPreloader();
	}

	cleanPreloader() {
		window.clearTimeout(this.preloadTimeout);
		window.clearInterval(this.preloadInterval);

		if (document.getElementById('font-preloader')) {
			document.body.removeChild(this.preloadElement);
		}

		this.preloadItems = 0;

		this.preloadTimeout = null;
		this.preloadInterval = null;
		this.preloadElement = null;
	}

	generateString() {
		let randomStringCharacters =
			'abcdefghijklmnopqrstuvwxyz0123456789._*&^!@#$%';
		let max = randomStringCharacters.length;
		let length = 50;

		let i;
		let returnArray = [];

		returnArray.push('&#xE87C;');

		for (i = 0; i < length; i++) {
			returnArray.push(
				randomStringCharacters.substring(
					Math.floor(Math.random() * max),
					1
				)
			);
		}

		return returnArray.join('');
	}

	runPreloader() {
		const vm = this;

		window.clearTimeout(this.preloadTimeout);
		window.clearInterval(this.preloadInterval);

		if (this.preloadItems === 0) {
			this.preloadComplete = true;
			this.dispatchObjectEvent('preloadReady', {
				success: false,
				error: 'noFontfacesProvided',
			});
			this.cleanPreloader();
		} else {
			
			this.preloadRunning = true;

			this.preloadTimeout = window.setTimeout(() => {
				vm.timeoutCheck();
			}, 3000);

			this.checkPreloaderStatus();

			if (!this.preloadComplete) {
				this.preloadInterval = window.setInterval(() => {
					vm.checkPreloaderStatus();
				}, 50);
			}
		}
	}

	preload(fontFace, weight, customString) {
		let styledSpan;
		let normalSpan;
		let fontString;

		let fontFamily = fontFace || 'serif';
		let fontWeight = weight || '400';

		if (!customString) {
			fontString = this.generateString();
		} else {
			fontString = this.generateString() + customString;
		}

		if (!this.preloadElement) {
			this.preloadElement = document.createElement('div');
			this.preloadElement.id = 'font-preloader';
			this.preloadElement.setAttribute(
				'style',
				'position:absolute;display:block;top:0px;width:100%;overflow:hidden;visibility:hidden;opacity:0;font-family:serif'
			);
			document.body.appendChild(this.preloadElement);
		}

		this.preloadRunning = false;
		this.preloadComplete = false;

		styledSpan = document.createElement('span');
		styledSpan.id = 'font-styled-' + this.preloadItems;
		styledSpan.setAttribute(
			'style',
			'font-family:' +
				fontFamily +
				';font-weight:' +
				fontWeight +
				';font-size:17px;letter-spacing:normal;white-space:nowrap;'
		);
		styledSpan.appendChild(document.createTextNode(fontString));
		this.preloadElement.appendChild(styledSpan);

		normalSpan = document.createElement('span');
		normalSpan.id = 'font-' + this.preloadItems;
		normalSpan.setAttribute(
			'style',
			'font-weight:' +
				fontWeight +
				';font-size:17px;letter-spacing:normal;white-space:nowrap;'
		);
		normalSpan.appendChild(document.createTextNode(fontString));
		this.preloadElement.appendChild(normalSpan);

		this.preloadItems++;
	}

	checkPreloaderStatus() {
		let boundingClientRect =
			typeof document.body.getBoundingClientRect === 'function'
				? true
				: false;
		let offsetWidth = document.body.offsetWidth ? true : false;
		let complete = true;
		let i;

		if (!boundingClientRect && !offsetWidth) {
			this.dispatchObjectEvent('preloadReady', {
				success: false,
				error: 'clientUnSupported',
			});
			this.cleanPreloader();
			return;
		}

		for (i = 0; i < this.preloadItems; i++) {
			if (boundingClientRect) {
				if (
					document
						.getElementById('font-styled-' + i)
						.getBoundingClientRect().width ===
					document.getElementById('font-' + i).getBoundingClientRect()
						.width
				) {
					complete = false;
				}
			}

			if (!boundingClientRect) {
				if (
					document.getElementById('font-styled-' + i).offsetWidth ===
					document.getElementById('font-' + i).getBoundingClientRect()
						.offsetWidth
				) {
					complete = false;
				}
			}
		}

		if (complete) {
			this.cleanPreloader();

			if (!this.preloadComplete) {
				this.preloadComplete = true;

				this.dispatchObjectEvent('preloadReady', {
					success: true,
				});
			}
		}
	}
}

export default WebfontPreloadService;
