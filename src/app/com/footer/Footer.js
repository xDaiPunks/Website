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
				<div className="FooterMenu">
					<div className="FooterMenuRow">
						<div className="FooterMenuBlock">
							<span className="FooterMenuBlockHeader">More</span>

							<span className="FooterMenuItem">
								<Button
									type={'footerButton'}
									label={'About xDai'}
									title={'About xDai'}
									onClick={() => {
										window.open(
											'https://www.xdaichain.com/#xdai-stable-chain'
										);
									}}
									cssClass={'FooterButton'}
								/>
							</span>

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
									label={'Setup Metamask'}
									title={'Setup Metamask'}
									onClick={() => {
										window.open(
											'https://www.xdaichain.com/for-users/wallets/metamask/metamask-setup#setting-up-metamask-for-xdai'
										);
									}}
									cssClass={'FooterButton'}
								/>
							</span>

							<span className="FooterMenuItem">
								<Button
									type={'footerButton'}
									label={'PUNK xDai Contract'}
									title={'PUNK xDai Contract'}
									onClick={() => {
										window.open(
											'https://blockscout.com/xdai/mainnet/token/0x988d1Be68F2C5cDE2516a2287c59Bd6302b7D20D/token-transfers'
										);
									}}
									cssClass={'FooterButton'}
								/>
							</span>

							<span className="FooterMenuItem">
								<Button
									type={'footerButton'}
									label={'PUNK Ethereum Contract'}
									title={'PUNK Ethereum Contract'}
									onClick={() => {
										window.open(
											'https://etherscan.io/token/0xd866db204b51ff53b4350fbf415d2e154844698f'
										);
									}}
									cssClass={'FooterButton'}
								/>
							</span>

							<span className="FooterMenuItem">
								<Button
									type={'footerButton'}
									label={'Token Sale Contract'}
									title={'Token Sale Contract'}
									onClick={() => {
										window.open(
											'https://blockscout.com/xdai/mainnet/address/0x4b1208Cb7BCaD7b5181c557F1295Fc3c722fa878/transactions'
										);
									}}
									cssClass={'FooterButton'}
								/>
							</span>

							<span className="FooterMenuItem">
								<Button
									type={'footerButton'}
									label={'xDaiPunks NFT Contract'}
									title={'xDaiPunks NFT Contract'}
									onClick={() => {
										window.open(
											'https://blockscout.com/xdai/mainnet/address/0x9f0B5B31e7FBDe3D9B1aF4e482Ef262b4ae9Ed90/read-contract'
										);
									}}
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
									title="Discord"
									href="https://discord.gg/TTZKkY2Ygx"
									target="_blank"
									rel="noreferrer">
									<img
										alt={'Discord'}
										className={'FooterSocialIcon'}
										src={
											'/static/media/images/footer-discord.svg'
										}
									/>
								</a>
								<div className="FooterSocialSpacer"></div>
								<a
									title="Telegram"
									href="https://t.me/xDaiPunks"
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
