class SlideShow {
	constructor() {
		this.initialized = false;
		this.slideTimeout = 6000;

		this.slideCount = null;
		this.slideIndex = null;

		this.slideInterval = null;

		this.slideShowElement = null;
		this.slideShowSlidesElements = null;

		this.changeSlide = this.changeSlide.bind(this);
	}

	pause() {
		this.clearInterval(this.slideInterval);
	}

	start() {
		if (this.initialized === false) {
			this.initialize();
		}

		this.slideInterval = setInterval(this.changeSlide, this.slideTimeout);
	}

	changeSlide() {
		let index;

		if (this.slideIndex + 1 >= this.slideCount) {
			index = 0;
			this.slideIndex = 0;
		} else {
			index = this.slideIndex + 1;
			this.slideIndex = this.slideIndex + 1;
		}

		this.slideShowSlidesElements.removeClass('Show');
		$(this.slideShowSlidesElements[index]).addClass('Show');
	}

	initialize() {
		this.initialized = true;

		this.slideShowElement = $('.SlideShow');
		this.slideShowSlidesElements = $('.SlideShow .SlideShowSlide');

		this.slideIndex = 0;
		this.slideCount = this.slideShowSlidesElements.length;
	}
}

export default SlideShow;
