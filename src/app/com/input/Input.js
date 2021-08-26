import React, { PureComponent } from 'react';
import UtilityService from 'src/app/services/UtilityService';

const utilityService = new UtilityService();

class Input extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			valid: true,
			value: props.defaultValue || '',
		};

		this.refElement = null;

		this.regularInput = React.createRef();
		this.searchInput = React.createRef();
		this.regularSelect = React.createRef();
		this.underlineInput = React.createRef();
		this.underlineSelect = React.createRef();
		this.underlineTextarea = React.createRef();

		this.input = this.input.bind(this);
		this.inputBlur = this.inputBlur.bind(this);
		this.inputFocus = this.inputFocus.bind(this);
		this.inputChange = this.inputChange.bind(this);

		this.inputSearch = this.inputSearch.bind(this);
		this.inputSearchBlur = this.inputSearchBlur.bind(this);
		this.inputSearchFocus = this.inputSearchFocus.bind(this);
		this.inputSearchChange = this.inputSearchChange.bind(this);

		this.selectRegular = this.selectRegular.bind(this);
		this.selectRegularBlur = this.selectRegularBlur.bind(this);
		this.selectRegularFocus = this.selectRegularFocus.bind(this);
		this.selectRegularChange = this.selectRegularChange.bind(this);

		this.inputUnderline = this.inputUnderline.bind(this);
		this.inputUnderlineBlur = this.inputUnderlineBlur.bind(this);
		this.inputUnderlineFocus = this.inputUnderlineFocus.bind(this);
		this.inputUnderlineChange = this.inputUnderlineChange.bind(this);

		this.textareaUnderline = this.textareaUnderline.bind(this);
		this.textareaUnderlineBlur = this.textareaUnderlineBlur.bind(this);
		this.textareaUnderlineFocus = this.textareaUnderlineFocus.bind(this);
		this.textareaUnderlineChange = this.textareaUnderlineChange.bind(this);
	}

	focus() {
		if (this.refElement) {
			this.refElement.current.focus();
		}
	}

	input(props) {
		let value;

		let id = this.props.id;
		let type = this.props.type;
		let onClick = this.props.onClick;
		let readOnly = this.props.readOnly;
		let className = this.props.className;
		let placeholder = this.props.placeholder;

		const onBlur = this.inputBlur;
		const onFocus = this.inputFocus;
		const onChange = this.inputChange;

		this.refElement = this.regularInput;

		if (readOnly !== true) {
			readOnly = null;
		} else {
			readOnly = 'read-only';
		}

		if (!className) {
			className = 'Input';
		}

		value = this.props.value || '';
		if (this.state.value) {
			value = this.state.value;
		}

		return (
			<div className={className}>
				<input
					ref={this.regularInput}
					id={id}
					name={id}
					type={type}
					value={value}
					readOnly={readOnly}
					placeholder={placeholder}
					onClick={onClick}
					onBlur={onBlur}
					onFocus={onFocus}
					onChange={onChange}
				/>
			</div>
		);
	}

	inputBlur(event) {
		event.preventDefault();

		const vm = this;
		if (vm.props.onBlur) {
			vm.props.onBlur(event);
		}
	}

	inputFocus(event) {
		event.preventDefault();

		const vm = this;
		if (vm.props.onFocus) {
			vm.props.onFocus(event);
		}
	}

	inputChange(event) {
		event.preventDefault();

		let valid;

		const vm = this;
		const type = vm.props.type;

		switch (type) {
			default:
				vm.setState(
					{
						valid: vm.state.valid,
						value: vm.regularInput.current.value,
					},
					() => {
						if (vm.props.onChange) {
							vm.props.onChange(event);
						}
					}
				);
				break;

			case 'email':
				valid = utilityService.validateEmail(
					vm.regularInput.current.value
				);

				vm.setState(
					{
						valid: valid,
						value: vm.regularInput.current.value
							.trim()
							.toLowerCase(),
					},
					() => {
						if (vm.props.onChange) {
							vm.props.onChange(event);
						}
					}
				);
				break;
		}
	}

	inputSearch(props) {
		let value;

		let id = this.props.id;
		let type = this.props.type;
		let onClick = this.props.onClick;
		let readOnly = this.props.readOnly;
		let className = this.props.className;
		let placeholder = this.props.placeholder;

		const onBlur = this.inputSearchBlur;
		const onFocus = this.inputSearchFocus;
		const onChange = this.inputSearchChange;

		this.refElement = this.searchInput;

		if (readOnly !== true) {
			readOnly = null;
		} else {
			readOnly = 'read-only';
		}

		if (!className) {
			className = 'InputSearch';
		}

		value = this.props.value || '';
		if (this.state.value) {
			value = this.state.value;
		}

		return (
			<div className={className}>
				<input
					ref={this.searchInput}
					id={id}
					name={id}
					type={type}
					value={value}
					readOnly={readOnly}
					placeholder={placeholder}
					onClick={onClick}
					onBlur={onBlur}
					onFocus={onFocus}
					onChange={onChange}
				/>
			</div>
		);
	}

	inputSearchBlur(event) {
		event.preventDefault();

		const vm = this;
		if (vm.props.onBlur) {
			vm.props.onBlur(event);
		}
	}

	inputSearchFocus(event) {
		event.preventDefault();

		const vm = this;
		if (vm.props.onFocus) {
			vm.props.onFocus(event);
		}
	}

	inputSearchChange(event) {
		event.preventDefault();

		let valid;

		const vm = this;
		const type = vm.props.type;

		switch (type) {
			default:
				vm.setState(
					{
						valid: vm.state.valid,
						value: vm.searchInput.current.value,
					},
					() => {
						if (vm.props.onChange) {
							vm.props.onChange(event);
						}
					}
				);
				break;

			case 'email':
				valid = utilityService.validateEmail(
					vm.searchInput.current.value
				);

				vm.setState(
					{
						valid: valid,
						value: vm.searchInput.current.value
							.trim()
							.toLowerCase(),
					},
					() => {
						if (vm.props.onChange) {
							vm.props.onChange(event);
						}
					}
				);
				break;
		}
	}

	inputUnderline(props) {
		let id = this.props.id;
		let type = this.props.type;
		let label = this.props.label;
		let onClick = this.props.onClick;

		let className = this.props.className;

		let value = this.props.value;
		let readOnly = this.props.readOnly;
		let hideInput = this.props.hideInput;
		let alwaysActive = this.props.alwaysActive;
		let defaultValue = this.props.defaultValue;

		const onBlur = this.inputUnderlineBlur;
		const onFocus = this.inputUnderlineFocus;
		const onChange = this.inputUnderlineChange;

		if (readOnly !== true) {
			readOnly = null;
		} else {
			readOnly = 'read-only';
		}

		if (!className) {
			className = 'InputUnderline';
		}

		if (
			alwaysActive === true ||
			(value !== '' && value !== null && value !== undefined) ||
			(defaultValue !== '' &&
				defaultValue !== null &&
				defaultValue !== undefined)
		) {
			className = className + ' Active';
		}

		if (hideInput === true) {
			className = className + ' HideDisplay';
		}

		return (
			<div className={className}>
				<label htmlFor={id}>{label}</label>
				<input
					ref={this.underlineInput}
					id={id}
					name={id}
					type={type}
					value={value}
					readOnly={readOnly}
					defaultValue={defaultValue}
					onBlur={onBlur}
					onFocus={onFocus}
					onClick={onClick}
					onChange={onChange}
				/>
				<div className="Underlines">
					<div className="Underline"></div>
					<div className="UnderlineAnimate"></div>
				</div>
			</div>
		);
	}

	inputUnderlineBlur(event) {
		event.preventDefault();

		const vm = this;
		if (vm.props.onBlur) {
			vm.props.onBlur(event);
		}
	}

	inputUnderlineFocus(event) {
		event.preventDefault();

		const vm = this;
		if (vm.props.onFocus) {
			vm.props.onFocus(event);
		}
	}

	inputUnderlineChange(event) {
		event.preventDefault();

		let valid;

		const vm = this;
		const type = vm.props.type;

		switch (type) {
			default:
				vm.setState(
					{
						valid: vm.state.valid,
						value: vm.underlineInput.current.value,
					},
					() => {
						if (vm.props.onChange) {
							vm.props.onChange(event);
						}
					}
				);
				break;

			case 'email':
				valid = utilityService.validateEmail(
					vm.underlineInput.current.value
				);

				vm.setState(
					{
						valid: valid,
						value: vm.underlineInput.current.value
							.trim()
							.toLowerCase(),
					},
					() => {
						if (vm.props.onChange) {
							vm.props.onChange(event);
						}
					}
				);
				break;
		}
	}

	selectRegular(props) {
		let i;
		let arrayCount;

		let labelValue;
		let labelColorClass;

		let optionItems = [];

		let id = this.props.id;
		let options = this.props.options;
		let className = this.props.className;
		let placeholder = this.props.placeholder;
		let selectedOption = this.props.selectedOption;

		const onBlur = this.selectRegularBlur;
		const onFocus = this.selectRegularFocus;
		const onChange = this.selectRegularChange;

		this.refElement = this.regularSelect;

		labelColorClass = 'SelectOverlay';

		if (!className) {
			className = 'Select';
		}

		if (placeholder) {
			optionItems.push(
				<option key={0} value={''}>
					{placeholder}
				</option>
			);

			if (this.state.value === '') {
				labelValue = placeholder;
			}

			if (this.state.value === '') {
				labelColorClass = 'SelectOverlay Placeholder';
			}
		}

		for (i = 0, arrayCount = options.length; i < arrayCount; i++) {
			if (options[i].value !== selectedOption) {
				optionItems.push(
					<option key={i + 1} value={options[i].value}>
						{options[i].label}
					</option>
				);
			} else {
				optionItems.push(
					<option
						key={i + 1}
						value={options[i].value}
						selected="selected">
						{options[i].label}
					</option>
				);
			}

			if (this.state.value) {
				if (this.state.value === options[i].value) {
					labelValue = options[i].label;
				}
			}
		}

		return (
			<div className={className}>
				<select
					ref={this.regularSelect}
					id={id}
					name={id}
					onBlur={onBlur}
					onFocus={onFocus}
					onChange={onChange}>
					{optionItems}
				</select>
				<div className={labelColorClass}>
					<input
						type={'text'}
						value={labelValue}
						readOnly={'read-only'}
					/>
				</div>
			</div>
		);
	}

	selectRegularBlur(event) {
		event.preventDefault();

		const vm = this;
		if (vm.props.onFocus) {
			vm.props.onFocus(event);
		}
	}

	selectRegularFocus(event) {
		event.preventDefault();

		const vm = this;
		if (vm.props.onFocus) {
			vm.props.onFocus(event);
		}
	}

	selectRegularChange(event) {
		event.preventDefault();

		const vm = this;
		const type = vm.props.type;

		switch (type) {
			default:
				vm.setState(
					{
						valid: vm.state.valid,
						value: vm.regularSelect.current.value.trim(),
					},
					() => {
						if (vm.props.onChange) {
							vm.props.onChange(event);
						}
					}
				);
				break;
		}
	}

	textareaUnderline(props) {
		let id = this.props.id;
		let type = this.props.type;
		let label = this.props.label;
		let onClick = this.props.onClick;

		let className = this.props.className;

		let value = this.props.value;
		let readOnly = this.props.readOnly;
		let hideInput = this.props.hideInput;
		let alwaysActive = this.props.alwaysActive;
		let defaultValue = this.props.defaultValue;

		const onBlur = this.textareaUnderlineBlur;
		const onFocus = this.textareaUnderlineFocus;
		const onChange = this.textareaUnderlineChange;

		if (readOnly !== true) {
			readOnly = null;
		} else {
			readOnly = 'read-only';
		}

		if (!className) {
			className = 'TextareaUnderline';
		}

		if (
			alwaysActive === true ||
			(value !== '' && value !== null && value !== undefined) ||
			(defaultValue !== '' &&
				defaultValue !== null &&
				defaultValue !== undefined)
		) {
			className = className + ' Active';
		}

		if (hideInput === true) {
			className = className + ' HideDisplay';
		}

		return (
			<div className={className}>
				<label htmlFor={id}>{label}</label>
				<textarea
					ref={this.underlineTextarea}
					id={id}
					name={id}
					type={type}
					value={value}
					readOnly={readOnly}
					defaultValue={defaultValue}
					onBlur={onBlur}
					onFocus={onFocus}
					onClick={onClick}
					onChange={onChange}
				/>
				<div className="Underlines">
					<div className="Underline"></div>
					<div className="UnderlineAnimate"></div>
				</div>
			</div>
		);
	}

	textareaUnderlineBlur(event) {
		event.preventDefault();

		const vm = this;
		if (vm.props.onBlur) {
			vm.props.onBlur(event);
		}
	}

	textareaUnderlineFocus(event) {
		event.preventDefault();

		const vm = this;
		if (vm.props.onFocus) {
			vm.props.onFocus(event);
		}
	}

	textareaUnderlineChange(event) {
		event.preventDefault();

		let valid;

		const vm = this;
		const type = vm.props.type;

		const inputTextarea = $(event.currentTarget);

		inputTextarea.css('height', '30px');
		inputTextarea.css('height', inputTextarea[0].scrollHeight + 'px');

		switch (type) {
			default:
				vm.setState(
					{
						valid: vm.state.valid,
						value: vm.underlineTextarea.current.value,
					},
					() => {
						if (vm.props.onChange) {
							vm.props.onChange(event);
						}
					}
				);
				break;

			case 'email':
				valid = utilityService.validateEmail(
					vm.underlineTextarea.current.value
				);

				vm.setState(
					{
						valid: valid,
						value: vm.underlineTextarea.current.value
							.trim()
							.toLowerCase(),
					},
					() => {
						if (vm.props.onChange) {
							vm.props.onChange(event);
						}
					}
				);
				break;
		}
	}

	render() {
		let props = this.props;
		let inputType = this.props.inputType;

		const Input = this.input;
		const InputSearch = this.inputSearch;
		const InputUnderline = this.inputUnderline;

		const SelectRegular = this.selectRegular;
		const TextareaUnderline = this.textareaUnderline;

		switch (inputType) {
			default:
				return null;

			case 'input':
				return <Input {...props} />;

			case 'inputSearch':
				return <InputSearch {...props} />;

			case 'inputUnderline':
				return <InputUnderline {...props} />;

			case 'select':
				return <SelectRegular {...props} />;

			case 'textareaUnderline':
				return <TextareaUnderline {...props} />;
		}
	}
}

export default Input;
