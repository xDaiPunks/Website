/* eslint-disable no-unused-expressions */

import React, { PureComponent } from 'react';

import Animate from 'src/app/services/Animate';

import AppService from 'src/app/services/AppService';
import EventService from 'src/app/services/EventService';
import ConfigService from 'src/app/services/ConfigService';
import HistoryService from 'src/app/services/HistoryService';
import UtilityService from 'src/app/services/UtilityService';
import TranslationService from 'src/app/services/TranslationService';

const animate = new Animate();

const appService = new AppService();
const eventService = new EventService();
const configService = new ConfigService();
const historyService = new HistoryService();
const utilityService = new UtilityService();
const translationService = new TranslationService();

class Modal extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			type: null,
			action: null,
			animate: null,
		};

		this.stateProps = {};

		this.guid = utilityService.guid();

		this.showModal = this.showModal.bind(this);
		this.hideModal = this.hideModal.bind(this);
		this.closeModal = this.closeModal.bind(this);

		this.emptyModal = this.emptyModal.bind(this);
		this.alertModal = this.alertModal.bind(this);

		this.languageSelect = this.languageSelect.bind(this);
		this.languageButtons = this.languageButtons.bind(this);
		this.languageSwitchModal = this.languageSwitchModal.bind(this);
	}

	componentDidMount() {
		let animate;

		const vm = this;

		vm.historyListener = historyService.history.listen(
			({ action, location }) => {
				vm.setState({
					type: null,
					animate: null,
					action: null,
				});
			}
		);

		eventService.on('hide:modal', vm.guid, (props) => {
			if (!props.animate) {
				animate = true;
			} else {
				animate = props.animate;
			}

			vm.hideModal({
				animate: animate,
				type: props.type,
			});
		});

		eventService.on('show:modal', vm.guid, (props) => {
			let key;
			let propsObject = {};

			for (key in props) {
				propsObject[key] = props[key];
			}

			if (!props.animate) {
				propsObject.animate = true;
			} else {
				propsObject.animate = props.animate;
			}

			vm.showModal(propsObject);
		});
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		let animationPromise;

		const vm = this;

		$('.Modal')[0].scrollTop;

		if (vm.state.action === 'showModal') {
			$('.Modal .ModalBackground').removeClass('Hidden');
			$('.Modal .ModalContentBlock').removeClass('Hidden');
		}

		if (vm.state.action === 'hideModal') {
			$('.Modal .ModalBackground').addClass('Hidden');

			animationPromise = animate.transitionAddClass(
				$('.Modal .ModalContentBlock'),
				'Hidden'
			);

			animationPromise.fail((error) => {
				vm.setState({
					type: null,
					animate: null,
					action: null,
				});
			});

			animationPromise.then((response) => {
				if (response.result === 'success') {
					vm.setState({
						type: null,
						animate: null,
						action: null,
					});
				}
			});
		}
	}

	showModal(props) {
		const vm = this;

		this.stateProps = props;

		vm.setState({
			type: props.type,
			animate: props.animate,
			action: 'showModal',
		});
	}

	hideModal(props) {
		const vm = this;

		vm.setState({
			type: props.type,
			animate: props.animate,
			action: 'hideModal',
		});
	}

	closeModal(event) {
		event.preventDefault();

		this.hideModal({
			type: this.state.type,
			animate: true,
		});
	}

	emptyModal(props) {
		return (
			<div className="Modal Hidden">
				<div className="ModalContent">
					<div className="ModalContentBlock Hidden"></div>
				</div>
				<div className="ModalBackground Hidden"></div>
			</div>
		);
	}

	alertModal(props) {
		let modalClass;
		let onClick = this.closeModal;

		if (props.animate !== true) {
			modalClass = 'Modal';
		} else {
			modalClass = 'Modal Animate';
		}

		return (
			<div className={modalClass}>
				<div className="ModalContent">
					<div className="ModalContentBlock Hidden">
						<button className="CloseModalButton" onClick={onClick}>
							<div className="CloseCrossLine Left"></div>
							<div className="CloseCrossLine Right"></div>
						</button>
						<span className="ModalHeader">{props.header}</span>
						<span className="ModalContentText">
							{props.content}
						</span>
						<div className="ModalButton">
							<button
								className="ModalContentButton"
								onClick={onClick}>
								<span className="ModalContentButtonText">
									{props.buttonText}
								</span>
							</button>
						</div>
					</div>
				</div>
				<div className="ModalBackground Hidden"></div>
			</div>
		);
	}

	languageSelect(event) {
		event.preventDefault();

		let language;

		if (!event || !event.currentTarget) {
			this.hideModal({
				type: this.state.type,
				animate: true,
			});
			return;
		}

		if (!event.currentTarget.getAttribute('data')) {
			this.hideModal({
				type: this.state.type,
				animate: true,
			});
			return;
		}

		language = event.currentTarget.getAttribute('data');

		if (
			language === configService.selectedLanguage ||
			configService.availableLanguages.includes(language) === false
		) {
			this.hideModal({
				type: this.state.type,
				animate: true,
			});
		} else {
			this.hideModal({
				type: this.state.type,
				animate: true,
			});

			appService.changeLanguageConfig(language);
		}
	}

	languageButtons() {
		return configService.availableLanguages.map((language, key) => {
			let onClick;

			let buttonClassName;
			let languageButtonText;

			onClick = this.languageSelect;

			if (language !== configService.selectedLanguage) {
				buttonClassName = 'LanguageSelector';
			} else {
				buttonClassName = 'LanguageSelector Selected';
			}

			languageButtonText = translationService.translate(
				'modal.language.' + language
			);

			return (
				<button
					key={key}
					data={language}
					onClick={onClick}
					className={buttonClassName}>
					<div className="LanguageSelectorIcon"></div>
					<span className="LanguageSelectorText">
						{languageButtonText}
					</span>
				</button>
			);
		});
	}

	languageSwitchModal(props) {
		let modalClass;
		let onClick = this.closeModal;

		const LanguageButtons = this.languageButtons;

		if (props.animate !== true) {
			modalClass = 'Modal';
		} else {
			modalClass = 'Modal Animate';
		}

		return (
			<div className={modalClass}>
				<div className="ModalContent">
					<div className="ModalContentBlock Hidden">
						<button className="CloseModalButton" onClick={onClick}>
							<div className="CloseCrossLine Left"></div>
							<div className="CloseCrossLine Right"></div>
						</button>
						<span className="ModalHeader">
							{translationService.translate(
								'modal.language.title'
							)}
						</span>
						<LanguageButtons />
						<div className="LanguageButtonSpacer"></div>
					</div>
				</div>
				<div className="ModalBackground Hidden"></div>
			</div>
		);
	}

	componentWillUnmount() {
		const vm = this;
		vm.historyListener();

		eventService.off('show:modal', vm.guid);
		eventService.off('hide:modal', vm.guid);
	}

	render() {
		let props;

		const type = this.state.type;

		const EmptyModal = this.emptyModal;
		const AlertModal = this.alertModal;
		const LanguageSwitchModal = this.languageSwitchModal;

		props = utilityService.extendObject(this.state, this.stateProps);

		switch (type) {
			default:
				return <EmptyModal {...props} />;

			case 'alertModal':
				return <AlertModal {...props} />;

			case 'languageModal':
				return <LanguageSwitchModal {...props} />;
		}
	}
}

export default Modal;
