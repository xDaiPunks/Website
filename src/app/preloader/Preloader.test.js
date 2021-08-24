/* eslint no-unused-vars: "off" */
import Preloader from './Preloader';
import EventService from 'src/app/services/EventService';

function renderPreloaderElement() {
	return $('body').html(
		'<div id="preloader">'+
			'<div class="content">'+

			'</div>'+
			'<div class="background"></div>'+
		'</div>'
	);
}

describe('Preloader', () => {
	renderPreloaderElement();

	const preloader = new Preloader();
	const eventService = new EventService();

	const preloaderElement = $('#preloader');

	it('should have hide method', () => {
		expect(preloader.hidePreloader).toBeDefined();
	});

	it('should have show method', () => {
		expect(preloader.showPreloader).toBeDefined();
	});

	it('should have a hide event listener', () => {
		expect(eventService.eventListeners['hide:preloader']).toBeDefined();
	});

	it('should have a show event listener', () => {
		expect(eventService.eventListeners['show:preloader']).toBeDefined();
	});

	it('should hide the preloader element by command', () => {
		preloader.hidePreloader();
		expect(preloaderElement.hasClass('hide')).toBe(true);
	});

	it('should show the preloader element by command', () => {
		preloader.showPreloader();
		expect(preloaderElement.hasClass('hide')).toBe(false);
	});

	it('should hide the preloader element on hide event', () => {
		eventService.dispatchObjectEvent('hide:preloader');
		expect(preloaderElement.hasClass('hide')).toBe(true);
	});

	it('should show the preloader element on show event', () => {
		eventService.dispatchObjectEvent('show:preloader');
		expect(preloaderElement.hasClass('hide')).toBe(false);
	});
});
