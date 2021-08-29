import axios from 'axios';
import React, { PureComponent } from 'react';

import Input from 'src/app/com/input/Input';
import Footer from 'src/app/com/footer/Footer';
import Button from 'src/app/com/button/Button';
import SlideShow from 'src/app/com/slideShow/SlideShow';

import Animate from 'src/app/services/Animate';

import AppService from 'src/app/services/AppService';
import UserService from 'src/app/services/UserService';
import ViewService from 'src/app/services/ViewService';
import PunkService from 'src/app/services/PunkService';
import EventService from 'src/app/services/EventService';
import RouteService from 'src/app/services/RouteService';
import ScrollService from 'src/app/services/ScrollService';
import ConfigService from 'src/app/services/ConfigService';
import UtilityService from 'src/app/services/UtilityService';
import TransitionService from 'src/app/services/TransitionService';
import TranslationService from 'src/app/services/TranslationService';
import Web3Service from 'src/app/services/Web3Service';

const slideShow = new SlideShow();

const animate = new Animate();

const appService = new AppService();
const userService = new UserService();
const viewService = new ViewService();
const punkService = new PunkService();
const eventService = new EventService();
const routeService = new RouteService();
const scrollService = new ScrollService();
const configService = new ConfigService();
const utilityService = new UtilityService();
const transitionService = new TransitionService();
const translationService = new TranslationService();

class Home extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {};

		this.componentName = 'Home';

		this.guid = utilityService.guid();

		this.getPunkAction = this.getPunkAction.bind(this);

		this.confettiItem = this.confettiItem.bind(this);
		this.subContentItem = this.subContentItem.bind(this);
	}

	updateView() {
		viewService.resetScroll();
		viewService.setViewSpacing();
		viewService.updateScrollWidth();
	}

	componentDidMount() {
		const vm = this;
		const pageElement = $('.' + vm.componentName + '.View');

		vm.updateView();

		eventService.dispatchObjectEvent('set:view', this.componentName);
		transitionService.updateTransition(this.props, this.componentName);

		eventService.on('resize', vm.guid, () => {
			setTimeout(() => {}, 10);
		});

		eventService.on('route:home', vm.guid, () => {
			pageElement.removeClass('Load');
		});

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

		eventService.on('change:punkData', vm.guid, (eventData) => {
			if (eventData.type === 'mint' || eventData.type === 'publicSale') {
				this.setState(this.state);
				this.forceUpdate();
			}
		});
	}

	componentDidUpdate() {
		viewService.resetScroll();
	}

	mintPunks(amount) {
		appService
			.mintPunks(2)
			.then((response) => {
				console.log(response);
				if (response.status !== true) {
					// show alert
				} else {
					routeService.navigateRoute('my-account');
				}
			})
			.catch((responseError) => {
				console.log(responseError);
			});
	}

	getPunkAction() {
		const vm = this;

		console.log(punkService.publicSale);
		console.log(userService);

		if (punkService.publicSale !== true) {
			console.log('show modal not started');

			eventService.dispatchObjectEvent('show:modal', {
				type: 'alertModal',
				header: 'Minting not started',
				content:
					'The minting of xDaiPunks has not started yet. It will start soon',
				buttonText: translationService.translate(
					'modal.error.okbutton'
				),
			});
		}

		if (punkService.publicSale === true) {
			if (userService.userSignedIn === true) {
				console.log('show modal select quantity');

				eventService.dispatchObjectEvent('show:modal', {
					type: 'mintModal',
					mintPunks: vm.mintPunks,
				});

				/*

				*/
			}
		}
	}

	confettiItem() {
		let number00 = Math.floor(Math.random() * 9999);
		let number01 = Math.floor(Math.random() * 9999);
		let number02 = Math.floor(Math.random() * 9999);
		let number03 = Math.floor(Math.random() * 9999);
		let number04 = Math.floor(Math.random() * 9999);
		let number05 = Math.floor(Math.random() * 9999);
		let number06 = Math.floor(Math.random() * 9999);
		let number07 = Math.floor(Math.random() * 9999);
		let number08 = Math.floor(Math.random() * 9999);
		let number09 = Math.floor(Math.random() * 9999);
		let number10 = Math.floor(Math.random() * 9999);
		let number11 = Math.floor(Math.random() * 9999);
		let number12 = Math.floor(Math.random() * 9999);

		let randomImage00 = '/static/media/punks/' + number00 + '.png';
		let randomImage01 = '/static/media/punks/' + number01 + '.png';
		let randomImage02 = '/static/media/punks/' + number02 + '.png';
		let randomImage03 = '/static/media/punks/' + number03 + '.png';
		let randomImage04 = '/static/media/punks/' + number04 + '.png';
		let randomImage05 = '/static/media/punks/' + number05 + '.png';
		let randomImage06 = '/static/media/punks/' + number06 + '.png';
		let randomImage07 = '/static/media/punks/' + number07 + '.png';
		let randomImage08 = '/static/media/punks/' + number08 + '.png';
		let randomImage09 = '/static/media/punks/' + number09 + '.png';
		let randomImage10 = '/static/media/punks/' + number10 + '.png';
		let randomImage11 = '/static/media/punks/' + number11 + '.png';
		let randomImage12 = '/static/media/punks/' + number12 + '.png';

		return (
			<div className="Confetti">
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage00}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage01}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage02}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage03}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage04}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage05}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage06}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage07}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage08}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage09}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage10}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage11}
							/>
						</div>
					</div>
				</div>
				<div className="ConfettiItem">
					<div className="ConfettiItemContainer">
						<div className="ConfettiBackground">
							<img
								alt={''}
								className={'ConfettiPunkImage'}
								src={randomImage12}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}

	subContentItem() {
		const vm = this;

		const publicSale = punkService.publicSale;
		const mintsCount = punkService.mintsCount;

		console.log('minstCount');

		console.log('Home publicSale', publicSale);
		console.log('Home mintscount', mintsCount);

		return (
			<div className="MintAmountContainer">
				<span className="MintText">NUMBER OF MINTED PUNKS</span>
				<div className="MintedItems">
					<span className="MintedItemsText">{mintsCount} / 1000</span>
				</div>
			</div>
		);
	}

	componentWillUnmount() {
		const vm = this;

		eventService.off('resize', vm.guid);
		eventService.off('route:home', vm.guid);
		eventService.off('force:state', vm.guid);
		eventService.off('preloader:hide', vm.guid);
		eventService.off('change:language', vm.guid);
		eventService.off('change:punkData', vm.guid);
	}

	render() {
		let number;
		let randomImage;

		let transitionClass;

		const vm = this;
		const ConfettiItem = vm.confettiItem;
		const SubContentItem = vm.subContentItem;

		if (this.props.animationType === 'overlay') {
			transitionClass = 'Overlay';
		}

		if (this.props.animationType === 'underlay') {
			transitionClass = 'Underlay';
		}

		number = Math.floor(Math.random() * 9999);
		randomImage = '/static/media/punks/' + number + '.png';

		return (
			<div
				className={
					this.componentName + ' View ' + transitionClass + ' Load'
				}>
				<div className="ViewBox">
					<div className="Intro">
						<div className="IntroStart">
							<ConfettiItem />
							<div className="IntroItem">
								<div className="PunkItem">
									<div className="PunkImage">
										<div className="PunkImageCircle">
											<img
												alt={''}
												className={'Punk'}
												src={randomImage}
											/>
										</div>
									</div>
									<span className="PunkText">
										<span className="TextDark">xDAI</span>
										<span className="TextLight">PUNKS</span>
									</span>
									<span className="PunkSubText">
										Here is your chance to own a genuine
										xDaiPunk!
									</span>
								</div>
								<div className="IntroSubContent">
									<SubContentItem />
								</div>
								<div className="IntroFooterContainer">
									<div className="FooterContainerSizer">
										<Button
											type={'actionButton'}
											label={'Get a punk for 12 xDai'}
											title={'Get a punk for 12 xDai'}
											onClick={(event) => {
												event.preventDefault();
												vm.getPunkAction();
											}}
											cssClass={'ActionButton'}
											iconImage="/static/media/images/icon-mint-white.svg"
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="IntroMapView">
							<div className="MapViewSpacerTop"></div>
							<span
								className="MapViewTitle"
								style={{
									opacity: 0,
									transform: 'translate3d(0, 60px, 0)',
								}}>
								{translationService.translate(
									'home.mapview.title'
								)}
							</span>

							<span
								className="MapViewSubTitle"
								style={{
									opacity: 0,
									transform: 'translate3d(0, 60px, 0)',
								}}>
								{translationService.translate(
									'home.mapview.subtitle'
								)}
							</span>

							<div
								className="MapView"
								style={{
									opacity: 0,
									transform: 'translate3d(0, 60px, 0)',
								}}>
								<div className="MapViewContainer">
									<img
										alt={''}
										className={'MapViewImage'}
										src={'/static/media/images/map.svg'}
									/>
								</div>

								<div className="MapViewImageContainer">
									<div className="MapContentLondon">
										<img
											alt={''}
											className={'MapContentImageOverlay'}
											src={
												'/static/media/images/map-london.jpg'
											}
											style={{
												transform:
													'translate(-50%, -50%) scale(0.0)',
											}}
										/>
									</div>
									<div className="MapContentMoscow">
										<img
											alt={''}
											className={'MapContentImageOverlay'}
											src={
												'/static/media/images/map-moscow.jpg'
											}
											style={{
												transform:
													'translate(-50%, -50%) scale(0.0)',
											}}
										/>
									</div>
									<div className="MapContentCaracas">
										<img
											alt={''}
											className={'MapContentImageOverlay'}
											src={
												'/static/media/images/map-caracas.jpg'
											}
											style={{
												transform:
													'translate(-50%, -50%) scale(0.0)',
											}}
										/>
									</div>
									<div className="MapContentSanFrancisco">
										<img
											alt={''}
											className={'MapContentImageOverlay'}
											src={
												'/static/media/images/map-san-francisco.jpg'
											}
											style={{
												transform:
													'translate(-50%, -50%) scale(0.0)',
											}}
										/>
									</div>
								</div>
							</div>
							<div className="MapViewSpacerBottom">
								<div
									className="MapViewActionButton"
									style={{
										opacity: 0,
										transform: 'translate3d(0, 60px, 0)',
									}}>
									<Button
										type={'navigationButtonIcon'}
										label={translationService.translate(
											'button.action.learnmore'
										)}
										title={translationService.translate(
											'button.action.learnmore'
										)}
										data="/about"
										iconImage="/static/media/images/arrow-next-purple.svg"
										onClick={this.navigate}
										cssClass={'FooterItemButtonAction'}
									/>
								</div>
							</div>
						</div>

						<div className="IntroEffective">
							<div className="IntroEffectiveHeader">
								<div className="IntroEffectiveHeaderHolder">
									<span
										className="EffectiveHeaderText One"
										style={{
											opacity: 0,
											transform:
												'translate3d(0, 60px, 0)',
										}}>
										{translationService.translate(
											'home.effective.header.one'
										)}
									</span>
									<span
										className="EffectiveHeaderText Two"
										style={{
											opacity: 0,
											transform:
												'translate3d(0, 60px, 0)',
										}}>
										{translationService.translate(
											'home.effective.header.two'
										)}
									</span>
									<span
										className="EffectiveHeaderSubText Three"
										style={{
											opacity: 0,
											transform:
												'translate3d(0, 60px, 0)',
										}}>
										{translationService.translate(
											'home.effective.header.subtext'
										)}
									</span>
								</div>
							</div>
							<div className="EffectiveActionButton">
								<Button
									type={'navigationButtonIcon'}
									label={translationService.translate(
										'button.action.learnmore'
									)}
									title={translationService.translate(
										'button.action.learnmore'
									)}
									data="/muevo-dollar"
									iconImage="/static/media/images/arrow-next-white.svg"
									onClick={this.navigate}
									cssClass={'FooterItemButtonAction Azure'}
								/>
							</div>
						</div>

						<div className="IntroExplainView">
							<div className="ExplainViewSpacerTop"></div>
							<span
								className="ExplainViewTitle"
								style={{
									opacity: 0,
									transform: 'translate3d(0, 60px, 0)',
								}}>
								{translationService.translate(
									'home.explain.title'
								)}
							</span>
							<div className="ExplainItem Left">
								<div className="ExplainText">
									<span
										className="ExplainTextTitle"
										style={{
											opacity: 0,
											transform:
												'translate3d(0, 60px, 0)',
										}}>
										{translationService.translate(
											'home.explain.easy.title'
										)}
									</span>
									<span
										className="ExplainTextSubText"
										style={{
											opacity: 0,
											transform:
												'translate3d(0, 60px, 0)',
										}}>
										{translationService.translate(
											'home.explain.easy.content'
										)}
									</span>
									<div className="ExplainDivider"></div>
								</div>
								<div
									className="ExplainImage"
									style={{
										opacity: 0,
										transform: 'translate3d(0, 60px, 0)',
									}}>
									<img
										alt={''}
										src={
											'/static/media/images/explain-joystick.png'
										}
										className={
											'ExplainImageContent JoyStick'
										}
									/>
								</div>
							</div>
							<div className="ExplainItem Right">
								<div
									className="ExplainImage"
									style={{
										opacity: 0,
										transform: 'translate3d(0, 60px, 0)',
									}}>
									<img
										alt={''}
										src={
											'/static/media/images/explain-delorean.png'
										}
										className={
											'ExplainImageContent DeLorean'
										}
									/>
								</div>
								<div className="ExplainText">
									<span
										className="ExplainTextTitle"
										style={{
											opacity: 0,
											transform:
												'translate3d(0, 60px, 0)',
										}}>
										{translationService.translate(
											'home.explain.fast.title'
										)}
									</span>
									<span
										className="ExplainTextSubText"
										style={{
											opacity: 0,
											transform:
												'translate3d(0, 60px, 0)',
										}}>
										{translationService.translate(
											'home.explain.fast.content'
										)}
									</span>

									<div className="ExplainDivider"></div>
								</div>
							</div>
							<div className="ExplainItem Left">
								<div className="ExplainText">
									<span
										className="ExplainTextTitle"
										style={{
											opacity: 0,
											transform:
												'translate3d(0, 60px, 0)',
										}}>
										{translationService.translate(
											'home.explain.economic.title'
										)}
									</span>
									<span
										className="ExplainTextSubText"
										style={{
											opacity: 0,
											transform:
												'translate3d(0, 60px, 0)',
										}}>
										{translationService.translate(
											'home.explain.economic.content'
										)}
									</span>

									<div className="ExplainDivider"></div>
								</div>
								<div
									className="ExplainImage"
									style={{
										opacity: 0,
										transform: 'translate3d(0, 60px, 0)',
									}}>
									<img
										alt={''}
										src={
											'/static/media/images/explain-cerdito.png'
										}
										className={
											'ExplainImageContent Cerdito'
										}
									/>
								</div>
							</div>
							<div className="ExplainItem Right">
								<div
									className="ExplainImage"
									style={{
										opacity: 0,
										transform: 'translate3d(0, 60px, 0)',
									}}>
									<img
										alt={''}
										src={
											'/static/media/images/explain-binocular.png'
										}
										className={
											'ExplainImageContent Binocular'
										}
									/>
								</div>
								<div className="ExplainText">
									<span
										className="ExplainTextTitle"
										style={{
											opacity: 0,
											transform:
												'translate3d(0, 60px, 0)',
										}}>
										{translationService.translate(
											'home.explain.secure.title'
										)}
									</span>
									<span
										className="ExplainTextSubText"
										style={{
											opacity: 0,
											transform:
												'translate3d(0, 60px, 0)',
										}}>
										{translationService.translate(
											'home.explain.secure.content'
										)}
									</span>

									<div className="ExplainDivider"></div>
								</div>
							</div>
						</div>

						<div className="IntroComoFunciona">
							<div className="ComoFuncionaSpacerTop"></div>
							<span
								className="ComoFuncionaTitle"
								style={{
									opacity: 0,
									transform: 'translate3d(0, 60px, 0)',
								}}>
								{translationService.translate(
									'home.howitworks.title'
								)}
							</span>
							<div className="ComoFuncionaContent">
								<div className="ComoFuncionaHolder">
									<div className="ComoFuncionaItem">
										<div
											className="ComoFuncionaImage"
											style={{
												opacity: 0,
												transform:
													'translate3d(0, 60px, 0)',
											}}>
											<img
												alt={''}
												src={
													'/static/media/images/funciona-recarga.svg'
												}
												className={
													'ComoFuncionaImageContent Recarga'
												}
											/>
										</div>
										<div
											className="ComoFuncionaText"
											style={{
												opacity: 0,
												transform:
													'translate3d(0, 60px, 0)',
											}}>
											<span className="ComoFuncionaTextTitle">
												{translationService.translate(
													'home.howitworks.funds.title'
												)}
											</span>
											<span className="ComoFuncionaTextContent">
												{translationService.translate(
													'home.howitworks.funds.content'
												)}
											</span>
										</div>
									</div>
									<div className="ComoFuncionaItem">
										<div
											className="ComoFuncionaImage"
											style={{
												opacity: 0,
												transform:
													'translate3d(0, 60px, 0)',
											}}>
											<img
												alt={''}
												src={
													'/static/media/images/funciona-envia.svg'
												}
												className={
													'ComoFuncionaImageContent Envia'
												}
											/>
										</div>
										<div
											className="ComoFuncionaText"
											style={{
												opacity: 0,
												transform:
													'translate3d(0, 60px, 0)',
											}}>
											<span className="ComoFuncionaTextTitle">
												{translationService.translate(
													'home.howitworks.send.title'
												)}
											</span>
											<span className="ComoFuncionaTextContent">
												{translationService.translate(
													'home.howitworks.send.content'
												)}
											</span>
										</div>
									</div>
								</div>
								<div className="ComoFuncionaHolder">
									<div className="ComoFuncionaItem">
										<div
											className="ComoFuncionaImage"
											style={{
												opacity: 0,
												transform:
													'translate3d(0, 60px, 0)',
											}}>
											<img
												alt={''}
												src={
													'/static/media/images/funciona-recibe.svg'
												}
												className={
													'ComoFuncionaImageContent Recibe'
												}
											/>
										</div>
										<div
											className="ComoFuncionaText"
											style={{
												opacity: 0,
												transform:
													'translate3d(0, 60px, 0)',
											}}>
											<span className="ComoFuncionaTextTitle">
												{translationService.translate(
													'home.howitworks.receive.title'
												)}
											</span>
											<span className="ComoFuncionaTextContent">
												{translationService.translate(
													'home.howitworks.receive.content'
												)}
											</span>
										</div>
									</div>
									<div className="ComoFuncionaItem">
										<div
											className="ComoFuncionaImage"
											style={{
												opacity: 0,
												transform:
													'translate3d(0, 60px, 0)',
											}}>
											<img
												alt={''}
												src={
													'/static/media/images/funciona-retira.svg'
												}
												className={
													'ComoFuncionaImageContent Retira'
												}
											/>
										</div>
										<div
											className="ComoFuncionaText"
											style={{
												opacity: 0,
												transform:
													'translate3d(0, 60px, 0)',
											}}>
											<span className="ComoFuncionaTextTitle">
												{translationService.translate(
													'home.howitworks.withdraw.title'
												)}
											</span>
											<span className="ComoFuncionaTextContent">
												{translationService.translate(
													'home.howitworks.withdraw.content'
												)}
											</span>
										</div>
									</div>
								</div>
							</div>
							<div className="ComoFuncionaButton">
								<div
									className="ComoFuncionaActionButton"
									style={{
										opacity: 0,
										transform: 'translate3d(0, 60px, 0)',
									}}>
									<Button
										type={'navigationButtonIcon'}
										label={translationService.translate(
											'button.action.learnmore'
										)}
										title={translationService.translate(
											'button.action.learnmore'
										)}
										data="/frequent-asked-questions"
										iconImage="/static/media/images/arrow-next-white.svg"
										onClick={this.navigate}
										cssClass={
											'FooterItemButtonAction Azure'
										}
									/>
								</div>
							</div>
							<div className="ComoFuncionaSpacerBottom"></div>
						</div>

						<div className="IntroParaNegocios">
							<div className="IntroParaNegociosHeader">
								<div className="ParaNegociosHeaderHolder">
									<span
										className="ParaNegociosHeaderText One"
										style={{
											opacity: 0,
											transform:
												'translate3d(0, 60px, 0)',
										}}>
										{translationService.translate(
											'home.business.header.one'
										)}
									</span>
									<span
										className="ParaNegociosHeaderText Two"
										style={{
											opacity: 0,
											transform:
												'translate3d(0, 60px, 0)',
										}}>
										{translationService.translate(
											'home.business.header.two'
										)}
									</span>
									<span
										className="ParaNegociosHeaderSubText Three"
										style={{
											opacity: 0,
											transform:
												'translate3d(0, 60px, 0)',
										}}>
										{translationService.translate(
											'home.business.header.subtext'
										)}
									</span>
								</div>
							</div>
							<div className="ParaNegociosActionButton">
								<Button
									type={'navigationButtonIcon'}
									label={translationService.translate(
										'button.action.learnmore'
									)}
									title={translationService.translate(
										'button.action.learnmore'
									)}
									data="/business"
									iconImage="/static/media/images/arrow-next-white.svg"
									onClick={this.navigate}
									cssClass={'FooterItemButtonAction Azure'}
								/>
							</div>
						</div>

						<Footer />
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
