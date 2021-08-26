import React, { PureComponent } from 'react';

import Button from 'src/app/com/button/Button';

import RouteService from 'src/app/services/RouteService';
import ScrollService from 'src/app/services/ScrollService';

const routeService = new RouteService();
const scrollService = new ScrollService();

class Header extends PureComponent {
	constructor(props) {
		super(props);

		this.pageId = props.pageId;
	}

	componentDidMount() {
		scrollService.setScrollTriggers('.Header .HeaderBackground', {
			x: 0,
			y: [100],
			css: {
				opacity: 1,
			},
			pageId: this.pageId,
		});
	}

	navigate(event) {
		event.preventDefault();

		routeService.navigateBack();
	}

	componentWillUnmount() {
		scrollService.removeScrollTriggers(this.pageId);
		scrollService.removeScrollParallax(this.pageId);
	}

	render() {
		return (
			<header className="Header">
				<div className="HeaderContent">
					<div className="BackButton">
						<Button
							type={'headerButton'}
							title={'Open website'}
							onClick={() => {
								routeService.navigateRoute('/');
							}}
							iconImage="/static/media/images/icon-globe.svg"
							cssClass={'HeaderButton'}
						/>
					</div>
				</div>
				<div
					className="HeaderBackgroundRequest"
					style={{
						opacity: 0,
					}}
				/>
			</header>
		);
	}
}

export default Header;
