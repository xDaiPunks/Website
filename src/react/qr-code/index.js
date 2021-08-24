const React = require('react');
const PropTypes = require('prop-types');
const QrCodeImpl = require('qr.js/lib/QRCode');
const ErrorCorrectLevel = require('qr.js/lib/ErrorCorrectLevel');

const MARGIN_SIZE = 4;

const DEFAULT_PROPS = {
	size: 192,
	level: 'L',
	bgColor: '#FFFFFF',
	fgColor: '#2B0066',
	includeMargin: false,
};

const PROP_TYPES = {
	value: PropTypes.string.isRequired,
	size: PropTypes.number,
	level: PropTypes.oneOf(['L', 'M', 'Q', 'H']),
	bgColor: PropTypes.string,
	fgColor: PropTypes.string,
	includeMargin: PropTypes.bool,
};

const SUPPORTS_PATH2D = (function() {
	try {
		new Path2D().addPath(new Path2D());
	} catch (e) {
		return false;
	}
	return true;
})();

function convertStr(str) {
	let i;
	let arrayCount;

	let charcode;

	let covertedString = '';

	for (i = 0, arrayCount = str.length; i < arrayCount; i++) {
		charcode = str.charCodeAt(i);
		if (charcode < 0x0080) {
			covertedString += String.fromCharCode(charcode);
		} else if (charcode < 0x0800) {
			covertedString += String.fromCharCode(0xc0 | (charcode >> 6));
			covertedString += String.fromCharCode(0x80 | (charcode & 0x3f));
		} else if (charcode < 0xd800 || charcode >= 0xe000) {
			covertedString += String.fromCharCode(0xe0 | (charcode >> 12));
			covertedString += String.fromCharCode(0x80 | ((charcode >> 6) & 0x3f));
			covertedString += String.fromCharCode(0x80 | (charcode & 0x3f));
		} else {
			i++;
			charcode =
				0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
			covertedString += String.fromCharCode(0xf0 | (charcode >> 18));
			covertedString += String.fromCharCode(0x80 | ((charcode >> 12) & 0x3f));
			covertedString += String.fromCharCode(0x80 | ((charcode >> 6) & 0x3f));
			covertedString += String.fromCharCode(0x80 | (charcode & 0x3f));
		}
	}
	return covertedString;
}

function removeProps(originalProps, extendedProps) {
	let key;
	let returnObject = {};

	for (key in originalProps) {
		if (
			Object.prototype.hasOwnProperty.call(originalProps, key) &&
			extendedProps.indexOf(key) < 0
		) {
			returnObject[key] = originalProps[key];
		}
	}

	return returnObject;
}

function generatePath(modules, margin = 0) {
	let start;

	let operations = [];

	modules.forEach(function(row, y) {
		start = null;

		row.forEach(function(cell, x) {
			if (!cell && start !== null) {
				// M0 0h7v1H0z injects the space with the move and drops the comma,
				// saving a char per operation
				operations.push(
					`M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`
				);
				start = null;
				return;
			}
			// end of row, clean up or skip
			if (x === row.length - 1) {
				if (!cell) {
					// We would have closed the op above already so this can only mean
					// 2+ light modules in a row.
					return;
				}
				if (start === null) {
					// Just a single dark module.
					operations.push(`M${x + margin},${y + margin} h1v1H${x + margin}z`);
				} else {
					// Otherwise finish the current line.
					operations.push(
						`M${start + margin},${y + margin} h${x + 1 - start}v1H${start +
							margin}z`
					);
				}
				return;
			}
			if (cell && start === null) {
				start = x;
			}
		});
	});

	return operations.join('');
}

class QrCodeCanvas extends React.PureComponent {
	componentDidMount() {
		this.update();
	}

	componentDidUpdate() {
		this.update();
	}

	update() {
		let ctx;
		let cells;
		let scale;
		let canvas;
		let margin;
		let numCells;
		let pixelRatio;

		let { value, size, level, bgColor, fgColor, includeMargin } = this.props;
		let qrcode = new QrCodeImpl(-1, ErrorCorrectLevel[level]);

		qrcode.addData(convertStr(value));
		qrcode.make();

		if (this._canvas != null) {
			canvas = this._canvas;
			ctx = canvas.getContext('2d');

			if (!ctx) {
				return;
			}

			cells = qrcode.modules;

			if (cells === null) {
				return;
			}

			margin = includeMargin ? MARGIN_SIZE : 0;
			numCells = cells.length + margin * 2;
			// We're going to scale this so that the number of drawable units
			// matches the number of cells. This avoids rounding issues, but does
			// result in some potentially unwanted single pixel issues between
			// blocks, only in environments that don't support Path2D.
			pixelRatio = window.devicePixelRatio || 1;
			canvas.height = canvas.width = size * pixelRatio;

			scale = (size / numCells) * pixelRatio;
			ctx.scale(scale, scale);
			// Draw solid background, only paint dark modules.
			ctx.fillStyle = bgColor;
			ctx.fillRect(0, 0, numCells, numCells);
			ctx.fillStyle = fgColor;
			
			if (SUPPORTS_PATH2D) {
				// $FlowFixMe: Path2D c'tor doesn't support args yet.
				ctx.fill(new Path2D(generatePath(cells, margin)));
			} else {
				cells.forEach(function(row, rdx) {
					row.forEach(function(cell, cdx) {
						if (cell) {
							ctx.fillRect(cdx + margin, rdx + margin, 1, 1);
						}
					});
				});
			}
		}
	}

	render() {
		const otherProps = removeProps(this.props, [
			'value',
			'size',
			'level',
			'bgColor',
			'fgColor',
			'style',
			'includeMargin',
		]);

		return React.createElement(
			'canvas',
			Object.assign(
				{
					className: 'QrCodeImage',
					ref: ref => (this._canvas = ref),
				},
				otherProps
			)
		);
	}
}

QrCodeCanvas.propTypes = PROP_TYPES;
QrCodeCanvas.defaultProps = DEFAULT_PROPS;

class QrCodeSVG extends React.PureComponent {
	render() {
		const { value, size, level, bgColor, fgColor, includeMargin } = this.props;
		const otherProps = removeProps(this.props, [
			'value',
			'size',
			'level',
			'bgColor',
			'fgColor',
			'includeMargin',
		]);
		// We'll use type===-1 to force QrCode to automatically pick the best type
		const qrcode = new QrCodeImpl(-1, ErrorCorrectLevel[level]);

		qrcode.addData(convertStr(value));
		qrcode.make();

		const cells = qrcode.modules;
		if (cells === null) {
			return null;
		}

		const margin = includeMargin ? MARGIN_SIZE : 0;
		// Drawing strategy: instead of a rect per module, we're going to create a
		// single path for the dark modules and layer that on top of a light rect,
		// for a total of 2 DOM nodes. We pay a bit more in string concat but that's
		// way faster than DOM ops.
		// For level 1, 441 nodes -> 2
		// For level 40, 31329 -> 2
		const fgPath = generatePath(cells, margin);
		const numCells = cells.length + margin * 2;

		return React.createElement(
			'svg',
			Object.assign(
				{
					className: 'QrCodeImage',
					width: size,
					height: size,
					shapeRendering: 'crispEdges',
					viewBox: `0 0 ${numCells} ${numCells}`,
				},
				otherProps
			),
			React.createElement('path', {
				fill: bgColor,
				d: `M0,0 h${numCells}v${numCells}H0z`,
			}),
			React.createElement('path', { fill: fgColor, d: fgPath })
		);
	}
}

QrCodeSVG.propTypes = PROP_TYPES;
QrCodeSVG.defaultProps = DEFAULT_PROPS;

const QrCode = props => {
	const { renderAs } = props;
	const otherProps = removeProps(props, ['renderAs']);
	const Component = renderAs === 'svg' ? QrCodeSVG : QrCodeCanvas;

	return React.createElement(Component, Object.assign({}, otherProps));
};

QrCode.defaultProps = Object.assign({ renderAs: 'canvas' }, DEFAULT_PROPS);

export default QrCode;
