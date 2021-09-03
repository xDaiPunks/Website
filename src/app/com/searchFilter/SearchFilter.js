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

class SearchFilter extends PureComponent {
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

		this.showSearchFilter = this.showSearchFilter.bind(this);
		this.hideSearchFilter = this.hideSearchFilter.bind(this);
		this.closeSearchFilter = this.closeSearchFilter.bind(this);

		this.languageSelect = this.languageSelect.bind(this);

		this.walletButtons = this.walletButtons.bind(this);
		this.languageButtons = this.languageButtons.bind(this);

		this.emptySearchFilter = this.emptySearchFilter.bind(this);

		this.buySearchFilter = this.buySearchFilter.bind(this);
		this.bidSearchFilter = this.bidSearchFilter.bind(this);
		this.mintSearchFilter = this.mintSearchFilter.bind(this);
		this.offerSearchFilter = this.offerSearchFilter.bind(this);
		this.alertSearchFilter = this.alertSearchFilter.bind(this);
		this.walletSearchFilter = this.walletSearchFilter.bind(this);
		this.languageSwitchSearchFilter = this.languageSwitchSearchFilter.bind(this);
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

			vm.hideSearchFilter({
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

			vm.showSearchFilter(propsObject);
		});
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		let animationPromise;

		const vm = this;

		$('.SearchFilter')[0].scrollTop;

		if (vm.state.action === 'showSearchFilter') {
			$('.SearchFilter .SearchFilterBackground').removeClass('Hidden');
			$('.SearchFilter .SearchFilterContentBlock').removeClass('Hidden');
		}

		if (vm.state.action === 'hideSearchFilter') {
			$('.SearchFilter .SearchFilterBackground').addClass('Hidden');

			animationPromise = animate.transitionAddClass(
				$('.SearchFilter .SearchFilterContentBlock'),
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

	showSearchFilter(props) {
		const vm = this;

		this.stateProps = props;

		vm.setState({
			type: props.type,
			animate: props.animate,
			action: 'showSearchFilter',
		});
	}

	hideSearchFilter(props) {
		const vm = this;

		vm.setState({
			type: props.type,
			animate: props.animate,
			action: 'hideSearchFilter',
		});
	}

	closeSearchFilter(event) {
		event.preventDefault();

		this.hideSearchFilter({
			type: this.state.type,
			animate: true,
		});
	}

	languageSelect(event) {
		event.preventDefault();

		let language;

		if (!event || !event.currentTarget) {
			this.hideSearchFilter({
				type: this.state.type,
				animate: true,
			});
			return;
		}

		if (!event.currentTarget.getAttribute('data')) {
			this.hideSearchFilter({
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
			this.hideSearchFilter({
				type: this.state.type,
				animate: true,
			});
		} else {
			this.hideSearchFilter({
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
						vm.hideSearchFilter({
							type: this.state.type,
							animate: false,
						});

						eventService.dispatchObjectEvent('force:state');

						eventService.dispatchObjectEvent('hide:preloader');
					})
					.catch((responseError) => {
						vm.hideSearchFilter({
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
						vm.hideSearchFilter({
							type: this.state.type,
							animate: false,
						});

						eventService.dispatchObjectEvent('force:state');

						eventService.dispatchObjectEvent('hide:preloader');
					})
					.catch((responseError) => {
						vm.hideSearchFilter({
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

		if (mobileDevice === true) {
			return (
				<>
					<button
						onClick={(event) => {
							event.preventDefault();
							vm.connectWeb3Service('walletConnect');
						}}
						className={'WalletConnector'}>
						<div className="WalletConnectorIcon">
							<img
								className="IconImage"
								alt={''}
								src={iconImageWalletConnect}
							/>
						</div>
						<span className="WalletConnectorText">
							{'Wallet connnect'}
						</span>
					</button>
				</>
			);
		} else {
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
						<button
							onClick={(event) => {
								event.preventDefault();
								vm.connectWeb3Service('walletConnect');
							}}
							className={'WalletConnector'}>
							<div className="WalletConnectorIcon">
								{' '}
								<img
									className="IconImage"
									alt={''}
									src={iconImageWalletConnect}
								/>
							</div>
							<span className="WalletConnectorText">
								{'Wallet connnect'}
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
								vm.connectWeb3Service('walletConnect');
							}}
							className={'WalletConnector'}>
							<div className="WalletConnectorIcon">
								{' '}
								<img
									className="IconImage"
									alt={''}
									src={iconImageWalletConnect}
								/>
							</div>
							<span className="WalletConnectorText">
								{'Wallet connnect'}
							</span>
						</button>
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

	emptySearchFilter(props) {
		return (
			<div className="SearchFilter Hidden">
				<div className="SearchFilterContent">
					<div className="SearchFilterContentBlock Hidden"></div>
				</div>
				<div className="SearchFilterBackground Hidden"></div>
			</div>
		);
	}

	buySearchFilter(props) {
		let value;
		let minAmount;

		let modalClass;

		const vm = this;

		const onClick = (event) => {
			vm.closeSearchFilter(event);
		};

		const onClickButton = (event) => {
			vm.closeSearchFilter(event);

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
			modalClass = 'SearchFilter';
		} else {
			modalClass = 'SearchFilter Animate';
		}

		return (
			<div className={modalClass}>
				<div className="SearchFilterContent">
					<div className="SearchFilterContentBlock Hidden">
						<button className="CloseSearchFilterButton" onClick={onClick}>
							<div className="CloseCrossLine Left"></div>
							<div className="CloseCrossLine Right"></div>
						</button>
						<span className="SearchFilterHeader">{'Buy punk'}</span>
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

						<div className="SearchFilterButton">
							<button
								className="SearchFilterContentButton"
								onClick={onClickButton}>
								<span className="SearchFilterContentButtonText">
									{'Buy punk'}
								</span>
							</button>
						</div>
					</div>
				</div>
				<div className="SearchFilterBackground Hidden"></div>
			</div>
		);
	}

	bidSearchFilter(props) {
		let value;
		let modalClass;

		const vm = this;

		const onClick = (event) => {
			vm.closeSearchFilter(event);
		};

		const onClickButton = (event) => {
			vm.closeSearchFilter(event);

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
			modalClass = 'SearchFilter';
		} else {
			modalClass = 'SearchFilter Animate';
		}

		return (
			<div className={modalClass}>
				<div className="SearchFilterContent">
					<div className="SearchFilterContentBlock Hidden">
						<button className="CloseSearchFilterButton" onClick={onClick}>
							<div className="CloseCrossLine Left"></div>
							<div className="CloseCrossLine Right"></div>
						</button>
						<span className="SearchFilterHeader">{'What amount?'}</span>
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

						<div className="SearchFilterButton">
							<button
								className="SearchFilterContentButton"
								onClick={onClickButton}>
								<span className="SearchFilterContentButtonText">
									{'Enter bid'}
								</span>
							</button>
						</div>
					</div>
				</div>
				<div className="SearchFilterBackground Hidden"></div>
			</div>
		);
	}

	mintSearchFilter(props) {
		let value;
		let modalClass;

		const vm = this;

		const onClick = (event) => {
			vm.closeSearchFilter(event);
		};

		const onClickButton = (event) => {
			vm.closeSearchFilter(event);

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
			modalClass = 'SearchFilter';
		} else {
			modalClass = 'SearchFilter Animate';
		}

		return (
			<div className={modalClass}>
				<div className="SearchFilterContent">
					<div className="SearchFilterContentBlock Hidden">
						<button className="CloseSearchFilterButton" onClick={onClick}>
							<div className="CloseCrossLine Left"></div>
							<div className="CloseCrossLine Right"></div>
						</button>
						<span className="SearchFilterHeader">
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

						<div className="SearchFilterButton">
							<button
								className="SearchFilterContentButton"
								onClick={onClickButton}>
								<span className="SearchFilterContentButtonText">
									{'Get punks'}
								</span>
							</button>
						</div>
					</div>
				</div>
				<div className="SearchFilterBackground Hidden"></div>
			</div>
		);
	}

	offerSearchFilter(props) {
		let value;
		let modalClass;

		const vm = this;

		const onClick = (event) => {
			vm.closeSearchFilter(event);
		};

		const onClickButton = (event) => {
			vm.closeSearchFilter(event);

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
			modalClass = 'SearchFilter';
		} else {
			modalClass = 'SearchFilter Animate';
		}

		return (
			<div className={modalClass}>
				<div className="SearchFilterContent">
					<div className="SearchFilterContentBlock Hidden">
						<button className="CloseSearchFilterButton" onClick={onClick}>
							<div className="CloseCrossLine Left"></div>
							<div className="CloseCrossLine Right"></div>
						</button>
						<span className="SearchFilterHeader">{'Minimum price'}</span>
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

						<div className="SearchFilterButton">
							<button
								className="SearchFilterContentButton"
								onClick={onClickButton}>
								<span className="SearchFilterContentButtonText">
									{'Offer for sale'}
								</span>
							</button>
						</div>
					</div>
				</div>
				<div className="SearchFilterBackground Hidden"></div>
			</div>
		);
	}

	alertSearchFilter(props) {
		let modalClass;
		let onClick = this.closeSearchFilter;

		if (props.animate !== true) {
			modalClass = 'SearchFilter';
		} else {
			modalClass = 'SearchFilter Animate';
		}

		return (
			<div className={modalClass}>
				<div className="SearchFilterContent">
					<div className="SearchFilterContentBlock Hidden">
						<button className="CloseSearchFilterButton" onClick={onClick}>
							<div className="CloseCrossLine Left"></div>
							<div className="CloseCrossLine Right"></div>
						</button>
						<span className="SearchFilterHeader">{props.header}</span>
						<span className="SearchFilterContentText">
							{props.content}
						</span>
						<div className="SearchFilterButton">
							<button
								className="SearchFilterContentButton"
								onClick={onClick}>
								<span className="SearchFilterContentButtonText">
									{props.buttonText}
								</span>
							</button>
						</div>
					</div>
				</div>
				<div className="SearchFilterBackground Hidden"></div>
			</div>
		);
	}

	walletSearchFilter(props) {
		let modalClass;
		let onClick = this.closeSearchFilter;

		const WalletButtons = this.walletButtons;

		if (props.animate !== true) {
			modalClass = 'SearchFilter';
		} else {
			modalClass = 'SearchFilter Animate';
		}

		return (
			<div className={modalClass}>
				<div className="SearchFilterContent">
					<div className="SearchFilterContentBlock Hidden">
						<button className="CloseSearchFilterButton" onClick={onClick}>
							<div className="CloseCrossLine Left"></div>
							<div className="CloseCrossLine Right"></div>
						</button>
						<span className="SearchFilterHeader AlignLeft">
							{'Connect to a wallet'}
						</span>
						<WalletButtons />
						<div className="LanguageButtonSpacer"></div>
					</div>
				</div>
				<div className="SearchFilterBackground Hidden"></div>
			</div>
		);
	}

	languageSwitchSearchFilter(props) {
		let modalClass;
		let onClick = this.closeSearchFilter;

		const LanguageButtons = this.languageButtons;

		if (props.animate !== true) {
			modalClass = 'SearchFilter';
		} else {
			modalClass = 'SearchFilter Animate';
		}

		return (
			<div className={modalClass}>
				<div className="SearchFilterContent">
					<div className="SearchFilterContentBlock Hidden">
						<button className="CloseSearchFilterButton" onClick={onClick}>
							<div className="CloseCrossLine Left"></div>
							<div className="CloseCrossLine Right"></div>
						</button>
						<span className="SearchFilterHeader">
							{translationService.translate(
								'modal.language.title'
							)}
						</span>
						<LanguageButtons />
						<div className="LanguageButtonSpacer"></div>
					</div>
				</div>
				<div className="SearchFilterBackground Hidden"></div>
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

		const EmptySearchFilter = this.emptySearchFilter;

		const BuySearchFilter = this.buySearchFilter;
		const BidSearchFilter = this.bidSearchFilter;
		const MintSearchFilter = this.mintSearchFilter;
		const OfferSearchFilter = this.offerSearchFilter;
		const AlertSearchFilter = this.alertSearchFilter;
		const WalletSearchFilter = this.walletSearchFilter;
		const LanguageSwitchSearchFilter = this.languageSwitchSearchFilter;

		props = utilityService.extendObject(this.state, this.stateProps);

		switch (type) {
			default:
				return <EmptySearchFilter {...props} />;

			case 'buySearchFilter':
				return <BuySearchFilter {...props} />;

			case 'bidSearchFilter':
				return <BidSearchFilter {...props} />;

			case 'mintSearchFilter':
				return <MintSearchFilter {...props} />;

			case 'offerSearchFilter':
				return <OfferSearchFilter {...props} />;

			case 'alertSearchFilter':
				return <AlertSearchFilter {...props} />;

			case 'walletSearchFilter':
				return <WalletSearchFilter {...props} />;

			case 'languageSearchFilter':
				return <LanguageSwitchSearchFilter {...props} />;
		}
	}
}

export default SearchFilter;
