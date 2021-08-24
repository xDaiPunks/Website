import React, { PureComponent } from 'react';

import Header from 'src/app/com/header/Header';
import Footer from 'src/app/com/footer/Footer';

import ViewService from 'src/app/services/ViewService';
import EventService from 'src/app/services/EventService';
import ScrollService from 'src/app/services/ScrollService';
import UtilityService from 'src/app/services/UtilityService';
import TransitionService from 'src/app/services/TransitionService';
import TranslationService from 'src/app/services/TranslationService';

const viewService = new ViewService();
const eventService = new EventService();
const utilityService = new UtilityService();
const transitionService = new TransitionService();
const translationService = new TranslationService();

class About extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};
		this.componentName = 'About';

		this.guid = utilityService.guid();
	}

	updateView() {
		viewService.setViewSpacing();
		viewService.updateScrollWidth();
	}

	componentDidMount() {
		const vm = this;
		const pageElement = $('.' + vm.componentName + '.View');

		vm.updateView();

		eventService.dispatchObjectEvent('set:view', this.componentName);
		transitionService.updateTransition(this.props, this.componentName);

		eventService.on('preloader:hide', vm.guid, () => {
			pageElement.removeClass('Load');
		});

		eventService.on('force:state', vm.guid, () => {
			this.setState(this.state);
			this.forceUpdate();
		});

		eventService.on('change:language', vm.guid, () => {
			this.setState(this.state);
			this.forceUpdate();
		});
	}

	componentWillUnmount() {
		const vm = this;
		eventService.off('resize', vm.guid);
		eventService.off('force:state', vm.guid);
		eventService.off('preloader:hide', vm.guid);
		eventService.off('change:language', vm.guid);
	}

	render() {
		let transitionClass;

		if (this.props.animationType === 'overlay') {
			transitionClass = 'Overlay';
		}

		if (this.props.animationType === 'underlay') {
			transitionClass = 'Underlay';
		}

		return (
			<div
				className={
					this.componentName + ' View ' + transitionClass + ' Load'
				}>
				<div className="ViewBox">
					<Header pageId="about" />
					<div className="ViewContent">
						<div className="PageHeaderImage">
							<img
								alt={''}
								className="PageHeaderImageContent"
								src="/static/media/images/about-header.jpg"
							/>
						</div>
						<div className="PageHeader">
							<span className="PageHeaderText">
								{translationService.translate('about.header')}
							</span>
						</div>
						<div className="PageContent">
							<span className="PageContentText">
								{translationService.translate(
									'about.content.one'
								)}
							</span>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}

export default About;
