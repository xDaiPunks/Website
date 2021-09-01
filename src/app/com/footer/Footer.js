import React, { PureComponent } from 'react';

import Button from 'src/app/com/button/Button';

import EventService from 'src/app/services/EventService';
import RouteService from 'src/app/services/RouteService';
import UtilityService from 'src/app/services/UtilityService';

const routeService = new RouteService();
const eventService = new EventService();
const utilityService = new UtilityService();

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
									label={'About xDai'}
									title={'About xDai'}
									onClick={() => {
										window.open(
											'https://www.xdaichain.com/'
										);
									}}
									cssClass={'FooterButton'}
								/>
							</span>
							<span className="FooterMenuItem">
								<Button
									type={'footerButton'}
									label={'Verify Genuineness'}
									title={'Verify Genuineness'}
									onClick={() => {
										window.open(
											'https://github.com/xDaiPunks/Genuineness'
										);
									}}
									cssClass={'FooterButton'}
								/>
							</span>
							<span className="FooterMenuItem">
								<Button
									type={'footerButton'}
									label={'xDaiPunks Github'}
									title={'xDaiPunks Github'}
									onClick={() => {
										window.open(
											'https://github.com/xDaiPunks'
										);
									}}
									cssClass={'FooterButton'}
								/>
							</span>
							<span className="FooterMenuItem">
								<Button
									type={'footerButton'}
									label={'xDaiPunks Smart Contract'}
									title={'xDaiPunks Smart Contract'}
									onClick={() => {
										window.open(
											'https://blockscout.com/xdai/mainnet/address/0x9f0B5B31e7FBDe3D9B1aF4e482Ef262b4ae9Ed90/read-contract'
										);
									}}
									cssClass={'FooterButton'}
								/>
							</span>
						</div>
						<div className="FooterMenuBlock">
							<span className="FooterMenuBlockHeader">Help</span>
							<span className="FooterMenuItem">
								<Button
									type={'footerButton'}
									label={'Get xDai'}
									title={'Get xDai'}
									onClick={() => {
										routeService.navigateRoute('/get-xdai');
									}}
									cssClass={'FooterButton'}
								/>
							</span>
							<span className="FooterMenuItem">
								<Button
									type={'footerButton'}
									label={'Connecting wallets'}
									title={'Connecting wallets'}
									onClick={() => {
										routeService.navigateRoute('/get-xdai');
									}}
									cssClass={'FooterButton'}
								/>
							</span>
							<span className="FooterMenuItem">
								<Button
									type={'footerButton'}
									label={'Using MetaMask'}
									title={'Using MetaMask'}
									onClick={() => {
										window.open('https://metamask.io/faqs');
									}}
									cssClass={'FooterButton'}
								/>
							</span>
							<span className="FooterMenuItem">
								<Button
									type={'footerButton'}
									label={'Using the marketplace'}
									title={'Using the marketplace'}
									onClick={() => {
										routeService.navigateRoute('/get-xdai');
									}}
									cssCla
									cssClass={'FooterButton'}
								/>
							</span>
						</div>
					</div>
					<div className="FooterMenuRow">
						<div className="FooterMenuBlock">
							<span className="FooterMenuBlockHeader">
								Follow us
							</span>
							<div className="FooterSocial">
								<a
									title="Twitter"
									href="https://twitter.com/xDaiPunks"
									target="_blank"
									rel="noreferrer">
									<img
										alt={'Twitter'}
										className={'FooterSocialIcon'}
										src={
											'/static/media/images/footer-twitter.svg'
										}
									/>
								</a>
								<div className="FooterSocialSpacer"></div>
								<a
									title="Telegram"
									href="https://github.com/xDaiPunks/"
									target="_blank"
									rel="noreferrer">
									<img
										alt={'Telegram'}
										className={'FooterSocialIcon'}
										src={
											'/static/media/images/footer-telegram.svg'
										}
									/>
								</a>
								<div className="FooterSocialSpacer"></div>
								<a
									title="Github"
									href="https://github.com/xDaiPunks/"
									target="_blank"
									rel="noreferrer">
									<img
										alt={'Github'}
										className={'FooterSocialIcon'}
										src={
											'/static/media/images/footer-github.svg'
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
