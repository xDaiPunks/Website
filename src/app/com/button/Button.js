import React, { Component } from 'react';

class Button extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.shouldUpdate !== false) {
			return true;
		} else {
			return false;
		}
	}

	appButton(props) {
		let ripple = props.ripple;
		let onClick = props.onClick;

		let generateClick = (event) => {
			event.preventDefault();
			if (ripple !== true) {
				if (onClick) {
					onClick(event);
				}
			} else {
				if (onClick) {
					onClick(event);
				}
				this.generateButtonRipple(event);
			}
		};

		if (!ripple) {
			return (
				<button
					className={props.cssClass}
					data={props.data}
					title={props.label}
					onClick={generateClick}>
					<span className="Txt">{props.label}</span>
				</button>
			);
		} else {
			return (
				<button
					className={props.cssClass}
					data={props.data}
					title={props.label}
					onClick={generateClick}>
					<span className="Ink" />
					<span className="Txt">{props.label}</span>
				</button>
			);
		}
	}

	formButton(props) {
		let ripple = props.ripple;
		let onClick = props.onClick;
		let iconImage = props.iconImage;

		let generateClick = (event) => {
			event.preventDefault();
			if (ripple !== true) {
				if (onClick) {
					onClick(event);
				}
			} else {
				if (onClick) {
					onClick(event);
				}
				this.generateButtonRipple(event);
			}
		};

		if (!ripple) {
			return (
				<button
					className={props.cssClass}
					data={props.data}
					title={props.label}
					onClick={generateClick}>
					<span className="Txt">{props.label}</span>
					<span className="Icon">
						<img className="IconImage" alt={''} src={iconImage} />
					</span>
				</button>
			);
		} else {
			return (
				<button
					className={props.cssClass}
					data={props.data}
					title={props.label}
					onClick={generateClick}>
					<span className="Ink" />
					<span className="Txt">{props.label}</span>
					<span className="Icon">
						<img className="IconImage" alt={''} src={iconImage} />
					</span>
				</button>
			);
		}
	}

	headerButton(props) {
		let ripple = props.ripple;
		let onClick = props.onClick;
		let iconImage = props.iconImage;

		let generateClick = (event) => {
			event.preventDefault();
			if (ripple !== true) {
				if (onClick) {
					onClick(event);
				}
			} else {
				if (onClick) {
					onClick(event);
				}
				this.generateButtonRipple(event);
			}
		};

		if (!ripple) {
			return (
				<button
					className={props.cssClass}
					data={props.data}
					title={props.label}
					onClick={generateClick}>
					<span className="Icon">
						<img className="IconImage" alt={''} src={iconImage} />
					</span>
				</button>
			);
		} else {
			return (
				<button
					className={props.cssClass}
					data={props.data}
					title={props.label}
					onClick={generateClick}>
					<span className="Ink" />
					<span className="Icon">
						<img className="IconImage" alt={''} src={iconImage} />
					</span>
				</button>
			);
		}
	}

	footerButton(props) {
		let ripple = props.ripple;
		let onClick = props.onClick;

		let generateClick = (event) => {
			event.preventDefault();
			if (ripple !== true) {
				if (onClick) {
					onClick(event);
				}
			} else {
				if (onClick) {
					onClick(event);
				}
				this.generateButtonRipple(event);
			}
		};

		if (!ripple) {
			return (
				<button
					className={props.cssClass}
					data={props.data}
					title={props.title}
					onClick={generateClick}>
					<span className="Txt">{props.label}</span>
				</button>
			);
		} else {
			return (
				<button
					className={props.cssClass}
					data={props.data}
					title={props.title}
					onClick={generateClick}>
					<span className="Ink" />
					<span className="Txt">{props.label}</span>
				</button>
			);
		}
	}

	formPageButton(props) {
		let ripple = props.ripple;
		let onClick = props.onClick;

		let generateClick = (event) => {
			event.preventDefault();
			if (ripple !== true) {
				if (onClick) {
					onClick(event);
				}
			} else {
				if (onClick) {
					onClick(event);
				}
				this.generateButtonRipple(event);
			}
		};

		if (!ripple) {
			return (
				<button
					className={props.cssClass}
					data={props.data}
					title={props.label}
					onClick={generateClick}>
					<span className="Txt">{props.label}</span>
				</button>
			);
		} else {
			return (
				<button
					className={props.cssClass}
					data={props.data}
					title={props.label}
					onClick={generateClick}>
					<span className="Ink" />
					<span className="Txt">{props.label}</span>
				</button>
			);
		}
	}

	navigationButton(props) {
		let ripple = props.ripple;
		let onClick = props.onClick;

		let iconImage = props.iconImage;

		let generateClick = (event) => {
			event.preventDefault();
			if (ripple !== true) {
				if (onClick) {
					onClick(event);
				}
			} else {
				if (onClick) {
					onClick(event);
				}
				this.generateButtonRipple(event);
			}
		};

		if (!ripple) {
			return (
				<button
					className={props.cssClass}
					data={props.data}
					title={props.label}
					onClick={generateClick}>
					<span className="Txt">{props.label}</span>
					<span className="Icon">
						<img className="IconImage" alt={''} src={iconImage} />
					</span>
				</button>
			);
		} else {
			return (
				<button
					className={props.cssClass}
					data={props.data}
					title={props.label}
					onClick={generateClick}>
					<span className="Ink" />
					<span className="Txt">{props.label}</span>
					<span className="Icon">
						<img className="IconImage" alt={''} src={iconImage} />
					</span>
				</button>
			);
		}
	}

	navigationButtonIcon(props) {
		let ripple = props.ripple;
		let onClick = props.onClick;
		let iconImage = props.iconImage;

		let generateClick = (event) => {
			event.preventDefault();
			if (ripple !== true) {
				if (onClick) {
					onClick(event);
				}
			} else {
				if (onClick) {
					onClick(event);
				}
				this.generateButtonRipple(event);
			}
		};

		if (!ripple) {
			return (
				<button
					className={props.cssClass}
					data={props.data}
					title={props.label}
					onClick={generateClick}>
					<span className="Txt">{props.label}</span>
					<span className="Icon">
						<img className="IconImage" alt={''} src={iconImage} />
					</span>
				</button>
			);
		} else {
			return (
				<button
					className={props.cssClass}
					data={props.data}
					title={props.label}
					onClick={generateClick}>
					<span className="Ink" />
					<span className="Txt">{props.label}</span>
					<span className="Icon">
						<img className="IconImage" alt={''} src={iconImage} />
					</span>
				</button>
			);
		}
	}

	render() {
		const props = this.props;
		const type = this.props.type;

		const AppButton = this.appButton;
		const FormButton = this.formButton;
		const HeaderButton = this.headerButton;
		const FooterButton = this.footerButton;
		const FormPageButton = this.formPageButton;
		const NavigationButton = this.navigationButton;
		const NavigationButtonIcon = this.navigationButtonIcon;

		switch (type) {
			default:
				return null;

			case 'appButton':
				return <AppButton {...props} />;

			case 'formButton':
				return <FormButton {...props} />;

			case 'headerButton':
				return <HeaderButton {...props} />;

			case 'footerButton':
				return <FooterButton {...props} />;

			case 'formPageButton':
				return <FormPageButton {...props} />;

			case 'navigationButton':
				return <NavigationButton {...props} />;

			case 'navigationButtonIcon':
				return <NavigationButtonIcon {...props} />;
		}
	}
}

export default Button;
