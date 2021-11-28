/* eslint-disable no-unused-expressions */

import React, { PureComponent } from 'react';

import Input from 'src/app/com/input/Input';

import Animate from 'src/app/services/Animate';

import AppService from 'src/app/services/AppService';
import Web3Service from 'src/app/services/Web3Service';
import EventService from 'src/app/services/EventService';
import ConfigService from 'src/app/services/ConfigService';
import HistoryService from 'src/app/services/HistoryService';
import UtilityService from 'src/app/services/UtilityService';
import TranslationService from 'src/app/services/TranslationService';

const animate = new Animate();

const appService = new AppService();
const web3Service = new Web3Service();
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

		this.buyInput = React.createRef();
		this.bidInput = React.createRef();
		this.mintInput = React.createRef();
		this.offerInput = React.createRef();
		this.contributeInput = React.createRef();

		this.showModal = this.showModal.bind(this);
		this.hideModal = this.hideModal.bind(this);
		this.closeModal = this.closeModal.bind(this);

		this.languageSelect = this.languageSelect.bind(this);

		this.walletButtons = this.walletButtons.bind(this);
		this.languageButtons = this.languageButtons.bind(this);

		this.emptyModal = this.emptyModal.bind(this);

		this.buyModal = this.buyModal.bind(this);
		this.bidModal = this.bidModal.bind(this);
		this.mintModal = this.mintModal.bind(this);
		this.offerModal = this.offerModal.bind(this);
		this.alertModal = this.alertModal.bind(this);
		this.blockModal = this.blockModal.bind(this);
		this.walletModal = this.walletModal.bind(this);

		this.participateModal = this.participateModal.bind(this);

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
			animate = true;

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

			if (!props.hasOwnProperty('animate')) {
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
			if (vm.state.animate !== false) {
				$('.Modal .ModalBackground').removeClass('Hidden');
				$('.Modal .ModalContentBlock').removeClass('Hidden');
			}

			if (vm.state.animate === false) {
				$('.Modal .ModalBackground').removeClass('Hidden');

				animationPromise = animate.transitionRemoveClass(
					$('.Modal .ModalContentBlock'),
					'Hidden'
				);

				animationPromise.fail((error) => {
					$('.Modal').addClass('Animate');
				});

				animationPromise.then((response) => {
					if (response.result === 'success') {
						$('.Modal').addClass('Animate');
					}
				});
			}
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

	connectWeb3Service(type) {
		const vm = this;

		if (type === 'walletConnect') {
			eventService.off('preloader:show', vm.guid);
			eventService.on('preloader:show', vm.guid, () => {
				eventService.off('preloader:show', vm.guid);
				web3Service
					.connectWalletConnect()
					.then((response) => {
						// console.log(response);
						vm.hideModal({
							type: this.state.type,
							animate: false,
						});

						eventService.dispatchObjectEvent('force:state');

						eventService.dispatchObjectEvent('hide:preloader');
					})
					.catch((responseError) => {
						vm.hideModal({
							type: this.state.type,
							animate: false,
						});

						// console.log(responseError);

						// console.log(responseError);
						eventService.dispatchObjectEvent('hide:preloader');
					});
			});

			eventService.dispatchObjectEvent('show:preloader');
		}

		if (type === 'metaMask') {
			eventService.off('preloader:show', vm.guid);
			eventService.on('preloader:show', vm.guid, () => {
				eventService.off('preloader:show', vm.guid);
				web3Service
					.connectMetaMask()
					.then((response) => {
						// console.log(response);
						vm.hideModal({
							type: this.state.type,
							animate: false,
						});

						eventService.dispatchObjectEvent('force:state');

						eventService.dispatchObjectEvent('hide:preloader');
					})
					.catch((responseError) => {
						vm.hideModal({
							type: this.state.type,
							animate: false,
						});

						// console.log(responseError);

						// console.log(responseError);
						eventService.dispatchObjectEvent('hide:preloader');
					});
			});

			eventService.dispatchObjectEvent('show:preloader');
		}
	}

	walletButtons(props) {
		const vm = this;

		const ethereum = window.ethereum;

		const mobileDevice = utilityService.browserSupport.mobileDevice;

		const iconImageMetaMask = '/static/media/images/icon-metamask.svg';
		const iconImageWalletConnect =
			'/static/media/images/icon-walletconnect.svg';

		// console.log(mobileDevice);

		if (ethereum) {
			return (
				<>
					<button
						onClick={(event) => {
							event.preventDefault();
							vm.connectWeb3Service('metaMask');
						}}
						className={'WalletConnector'}>
						<div className="WalletConnectorIcon">
							<img
								className="IconImage"
								alt={''}
								src={iconImageMetaMask}
							/>
						</div>
						<span className="WalletConnectorText">
							{'MetaMask'}
						</span>
					</button>
				</>
			);
		} else {
			return (
				<>
					<button
						onClick={(event) => {
							event.preventDefault();
							window.open('https://metamask.io/download');
						}}
						className={'WalletConnector'}>
						<div className="WalletConnectorIcon">
							<img
								className="IconImage"
								alt={''}
								src={iconImageMetaMask}
							/>
						</div>
						<span className="WalletConnectorText">
							{'Install MetaMask'}
						</span>
					</button>
				</>
			);
		}
	}

	languageButtons(props) {
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

	buyModal(props) {
		let value;
		let minAmount;

		let modalClass;

		const vm = this;

		const onClick = (event) => {
			vm.closeModal(event);
		};

		const onClickButton = (event) => {
			vm.closeModal(event);

			if (props.buyPunk) {
				if (
					vm.buyInput &&
					vm.buyInput.current &&
					vm.buyInput.current.state &&
					vm.buyInput.current.state.value
				) {
					value = vm.buyInput.current.state.value.replace(',', '.');
					value = parseFloat(value.trim());
					minAmount = parseFloat(props.minAmount);

					if (value > 0 && value >= minAmount) {
						props.buyPunk(value);
					}
				}
			}
		};

		if (props.minAmount) {
			value = props.minAmount;
		}

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
						<span className="ModalHeader">{'Buy punk'}</span>
						<div className="MintInput">
							<Input
								ref={vm.buyInput}
								id={'inputNumber'}
								type={'text'}
								inputType={'input'}
								defaultValue={value}
								placeholder={'Enter an amount'}
							/>
						</div>

						<div className="ModalButton">
							<button
								className="ModalContentButton"
								onClick={onClickButton}>
								<span className="ModalContentButtonText">
									{'Buy punk'}
								</span>
							</button>
						</div>
					</div>
				</div>
				<div className="ModalBackground Hidden"></div>
			</div>
		);
	}

	bidModal(props) {
		let value;
		let modalClass;

		const vm = this;

		const onClick = (event) => {
			vm.closeModal(event);
		};

		const onClickButton = (event) => {
			vm.closeModal(event);

			if (props.enterBidForPunk) {
				if (
					vm.bidInput &&
					vm.bidInput.current &&
					vm.bidInput.current.state &&
					vm.bidInput.current.state.value
				) {
					value = vm.bidInput.current.state.value.replace(',', '.');
					value = parseFloat(value.trim());

					if (value > 0) {
						props.enterBidForPunk(value);
					}
				}
			}
		};

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
						<span className="ModalHeader">{'Amount in xDai?'}</span>
						<div className="MintInput">
							<Input
								ref={vm.bidInput}
								id={'inputNumber'}
								type={'text'}
								inputType={'input'}
								defaultValue={''}
								placeholder={'Enter an amount'}
							/>
						</div>

						<div className="ModalButton">
							<button
								className="ModalContentButton"
								onClick={onClickButton}>
								<span className="ModalContentButtonText">
									{'Enter bid'}
								</span>
							</button>
						</div>
					</div>
				</div>
				<div className="ModalBackground Hidden"></div>
			</div>
		);
	}

	mintModal(props) {
		let value;
		let modalClass;

		const vm = this;

		const onClick = (event) => {
			vm.closeModal(event);
		};

		const onClickButton = (event) => {
			vm.closeModal(event);

			if (props.mintPunks) {
				if (
					vm.mintInput &&
					vm.mintInput.current &&
					vm.mintInput.current.state &&
					vm.mintInput.current.state.value
				) {
					value = parseInt(
						vm.mintInput.current.state.value.trim(),
						10
					);

					if (value > 0 && value <= 20) {
						// console.log(value);
						props.mintPunks(value);
					}
				}
			}
		};

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
							{'Number of xDaiPunks'}
						</span>
						<div className="MintInput">
							<Input
								ref={vm.mintInput}
								id={'inputNumber'}
								type={'text'}
								inputType={'input'}
								defaultValue={'1'}
								placeholder={'How many'}
							/>
						</div>

						<div className="ModalButton">
							<button
								className="ModalContentButton"
								onClick={onClickButton}>
								<span className="ModalContentButtonText">
									{'Get punks'}
								</span>
							</button>
						</div>
					</div>
				</div>
				<div className="ModalBackground Hidden"></div>
			</div>
		);
	}

	offerModal(props) {
		let value;
		let modalClass;

		const vm = this;

		const onClick = (event) => {
			vm.closeModal(event);
		};

		const onClickButton = (event) => {
			vm.closeModal(event);

			if (props.offerPunkForSale) {
				if (
					vm.offerInput &&
					vm.offerInput.current &&
					vm.offerInput.current.state &&
					vm.offerInput.current.state.value
				) {
					value = vm.offerInput.current.state.value.replace(',', '.');
					value = parseFloat(value.trim());

					if (value > 0) {
						props.offerPunkForSale(value);
					}
				}
			}
		};

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
						<span className="ModalHeader">{'Minimum price'}</span>
						<div className="MintInput">
							<Input
								ref={vm.offerInput}
								id={'inputNumber'}
								type={'text'}
								inputType={'input'}
								defaultValue={''}
								placeholder={'Enter a price'}
							/>
						</div>

						<div className="ModalButton">
							<button
								className="ModalContentButton"
								onClick={onClickButton}>
								<span className="ModalContentButtonText">
									{'Offer for sale'}
								</span>
							</button>
						</div>
					</div>
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
						<span
							className="ModalContentText"
							dangerouslySetInnerHTML={{
								__html: props.content,
							}}></span>
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

	blockModal(props) {
		let modalClass;

		const vm = this;

		const onClick = (event) => {
			vm.closeModal(event);
			console.log(props);
			
			if (props.hasOwnProperty('blockStorage')) {
				localStorage.setItem(
					props.blockStorage,
					props.blockStorageValue
				);
			}
		};

		if (props.animate !== true) {
			modalClass = 'Modal Underlay';
		} else {
			modalClass = 'Modal Underlay Animate';
		}

		return (
			<div className={modalClass}>
				<div className="ModalContent">
					<div className="ModalContentBlock Hidden">
						<span className="ModalHeader">{props.header}</span>
						<span
							className="ModalContentText"
							dangerouslySetInnerHTML={{
								__html: props.content,
							}}></span>
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
				<div className="ModalBackground Dark Hidden"></div>
			</div>
		);
	}

	walletModal(props) {
		let modalClass;
		let onClick = this.closeModal;

		const WalletButtons = this.walletButtons;

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
						<span className="ModalHeader AlignLeft">
							{'Connect wallet'}
						</span>
						<WalletButtons />
						<div className="LanguageButtonSpacer"></div>
					</div>
				</div>
				<div className="ModalBackground Hidden"></div>
			</div>
		);
	}

	participateModal(props) {
		let value;
		let modalClass;

		const vm = this;

		const onClick = (event) => {
			vm.closeModal(event);
		};

		const onClickButton = (event) => {
			vm.closeModal(event);

			if (props.participateSale) {
				if (
					vm.contributeInput &&
					vm.contributeInput.current &&
					vm.contributeInput.current.state &&
					vm.contributeInput.current.state.value
				) {
					value = vm.contributeInput.current.state.value.replace(
						',',
						'.'
					);
					value = parseFloat(value.trim());

					if (value > 0) {
						props.participateSale(value);
					}
				}
			}
		};

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
							{'Amount to contribute?'}
						</span>
						<div className="MintInput">
							<Input
								ref={vm.contributeInput}
								id={'inputNumber'}
								type={'text'}
								inputType={'input'}
								defaultValue={''}
								placeholder={'Enter an amount'}
							/>
						</div>

						<div className="ModalButton">
							<button
								className="ModalContentButton"
								onClick={onClickButton}>
								<span className="ModalContentButtonText">
									{'Add contribution'}
								</span>
							</button>
						</div>
					</div>
				</div>
				<div className="ModalBackground Hidden"></div>
			</div>
		);
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
		eventService.off('preloader:show', vm.guid);
	}

	render() {
		let props;

		const type = this.state.type;

		const EmptyModal = this.emptyModal;

		const BuyModal = this.buyModal;
		const BidModal = this.bidModal;
		const MintModal = this.mintModal;
		const OfferModal = this.offerModal;
		const AlertModal = this.alertModal;
		const BlockModal = this.blockModal;
		const WalletModal = this.walletModal;
		const ParticipateModal = this.participateModal;
		const LanguageSwitchModal = this.languageSwitchModal;

		props = utilityService.extendObject(this.state, this.stateProps);

		switch (type) {
			default:
				return <EmptyModal {...props} />;

			case 'buyModal':
				return <BuyModal {...props} />;

			case 'bidModal':
				return <BidModal {...props} />;

			case 'mintModal':
				return <MintModal {...props} />;

			case 'offerModal':
				return <OfferModal {...props} />;

			case 'alertModal':
				return <AlertModal {...props} />;

			case 'blockModal':
				return <BlockModal {...props} />;

			case 'walletModal':
				return <WalletModal {...props} />;

			case 'participateModal':
				return <ParticipateModal {...props} />;

			case 'languageModal':
				return <LanguageSwitchModal {...props} />;
		}
	}
}

export default Modal;
