import React, { PureComponent } from 'react';

import Button from 'src/app/com/button/Button';

import EventService from 'src/app/services/EventService';
import RouteService from 'src/app/services/RouteService';
import UtilityService from 'src/app/services/UtilityService';
import TranslationService from 'src/app/services/TranslationService';

const routeService = new RouteService();
const eventService = new EventService();
const utilityService = new UtilityService();
const translationService = new TranslationService();

class Footer extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};
		this.componentName = 'Footer';

		this.guid = utilityService.guid();
	}

	componentDidMount() {
		const vm = this;

		eventService.on('change:language', vm.guid, () => {
			this.setState(this.state);
			this.forceUpdate();
		});
	}

	navigate(event) {
		let domElement;
		let targetData;

		event.preventDefault();

		if (!event || !event.currentTarget) {
			return;
		}

		if (!event.currentTarget.getAttribute('data')) {
			return;
		}

		targetData = event.currentTarget.getAttribute('data');

		if (targetData.substr(0, 1) === '/') {
			routeService.navigateRoute(targetData);
		}

		if (targetData.substr(0, 6) === 'scroll') {
			domElement = $('.' + targetData.split(':')[1]);
			routeService.navigateScrollPosition(domElement);
		}

		routeService.navigateRoute(event.currentTarget.getAttribute('data'));
	}

	showLanguageModal(event) {
		event.preventDefault();
		eventService.dispatchObjectEvent('show:modal', {
			type: 'languageModal',
		});
	}

	componentWillUnmount() {
		const vm = this;
		eventService.off('change:language', vm.guid);
	}

	render() {
		return (
			<div className="Footer">
				<div className="LogoFooter">
					<img
						alt={'Muevo'}
						className={'LogoFooterImage'}
						src={'/static/media/images/logo.svg'}
					/>
				</div>
				<div className="FooterMenu">
					<div className="FooterMenuRow">
						<div className="FooterMenuBlock">
							<span className="FooterMenuBlockHeader">
								xDaiPunks
							</span>
							<span className="FooterMenuItem">
								<Button
									type={'footerButton'}
									label={'Disclaimer'}
									title={'Disclaimer'}
									onClick={this.showLanguageModal}
									cssClass={'FooterButton'}
								/>
							</span>
							<span className="FooterMenuItem">
								<Button
									type={'footerButton'}
									label={translationService.translate(
										'footer.terms.label'
									)}
									title={translationService.translate(
										'footer.terms.label'
									)}
									
									onClick={this.navigate}
									cssClass={'FooterButton'}
								/>
							</span>
							<span className="FooterMenuItem">
								<Button
									type={'footerButton'}
									label={translationService.translate(
										'footer.privacy.label'
									)}
									title={translationService.translate(
										'footer.privacy.label'
									)}
									data="/privacy-cookies"
									onClick={this.navigate}
									cssClass={'FooterButton'}
								/>
							</span>
						</div>
						<div className="FooterMenuBlock">
							<span className="FooterMenuBlockHeader">Help</span>
							<span className="FooterMenuItem">
								<Button
									type={'footerButton'}
									label={translationService.translate(
										'footer.contact.label'
									)}
									title={translationService.translate(
										'footer.contact.label'
									)}
									data="/contact"
									onClick={this.navigate}
									cssClass={'FooterButton'}
								/>
							</span>
							<span className="FooterMenuItem">
								<Button
									type={'footerButton'}
									label={translationService.translate(
										'footer.business.label'
									)}
									title={translationService.translate(
										'footer.business.label'
									)}
									data="/business"
									onClick={this.navigate}
									cssClass={'FooterButton'}
								/>
							</span>
							<span className="FooterMenuItem">
								<Button
									type={'footerButton'}
									label={translationService.translate(
										'footer.frequentasked.label'
									)}
									title={translationService.translate(
										'footer.frequentasked.label'
									)}
									data="/frequent-asked-questions"
									onClick={this.navigate}
									cssClass={'FooterButton'}
								/>
							</span>
						</div>
					</div>
					<div className="FooterMenuRow">
						<div className="FooterMenuBlock">
							<span className="FooterMenuBlockHeader">
								{translationService.translate(
									'footer.followus.label'
								)}
							</span>
							<div className="FooterSocial">
								<a
									title="Instagram"
									href="https://www.instagram.com/muevo.co/"
									target="_blank"
									rel="noreferrer">
									<img
										alt={'Instagram'}
										className={'FooterInsta'}
										src={
											'/static/media/images/footer-insta.svg'
										}
									/>
								</a>
								<div className="FooterSocialSpacer"></div>
								<a
									title="Twitter"
									href="https://twitter.com/muevoco"
									target="_blank"
									rel="noreferrer">
									<img
										alt={'Twitter'}
										className={'FooterTwitter'}
										src={
											'/static/media/images/footer-twitter.svg'
										}
									/>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Footer;
