import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

describe('App', () => {
	const element = document.createElement('div');

	it('should render without crashing', () => {
		ReactDOM.render(<App />, element);
	});
});
