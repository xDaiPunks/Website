/* eslint-disable no-unused-vars */
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import serviceWorkerRegister from 'src/serviceWorkerRegister';

import App from 'src/app/App';
import ReactClick from 'src/react/click/';
import Preloader from 'src/app/preloader/Preloader';

import PreloadService from 'src/app/services/PreloadService';
import WebfontPreloadService from 'src/app/services/WebfontPreloadService';

const preloader = new Preloader();

const preloadService = new PreloadService();
const webfontPreloadService = new WebfontPreloadService();

const initialize = () => {
	preloadService.preload('/static/media/images/astronaut.png');
	preloadService.preload('/static/media/images/intro-background.jpg');

	preloadService.on('preloadReady', this, (e) => {
		webfontPreloadService.preload('Gilroy', '900');

		webfontPreloadService.on('preloadReady', this, (e) => {
			webfontPreloadService.off('preloadReady', this);

			ReactDOM.render(<App />, document.getElementById('AppRoot'));
		});

		webfontPreloadService.runPreloader();
	});

	preloadService.runPreloader();
};

initialize();
