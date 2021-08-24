/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-loop-func */
/* eslint-disable global-require */
/* eslint-disable no-console */

let files;
let fileName;
let fileContents;

const fs = require('fs');
const prettier = require('prettier');

const directory = 'src/translations';

const CsvConvert = require('./csvConvert');

const csvConvert = new CsvConvert();

formatFiles();

csvConvert.events.on('error', (error) => {
	console.error(error);
});

// eslint-disable-next-line no-unused-vars
csvConvert.events.on('success', (result) => {
	formatFilesPrettier();
});

csvConvert.convert('src/translations/**/**.*');

function formatFiles() {
	files = fs.readdirSync(directory);

	for (const file of files) {
		if (file.endsWith('.csv')) {
			fileName = file;

			fileContents = fs.readFileSync(directory + '/' + file, 'utf8');

			fs.writeFileSync(directory + '/' + fileName, fileContents, 'utf8');
		}
	}
}

function formatFilesPrettier() {
	let formattedContents;

	files = fs.readdirSync(directory);

	for (const file of files) {
		if (file.endsWith('.json')) {
			fileName = file;

			fileContents = fs.readFileSync(directory + '/' + file, 'utf8');

			fileContents = fileContents.replace(/\\n/g, '');
			fileContents = fileContents.replace(/\\r/g, '');

			formattedContents = prettier.format(fileContents, {
				parser: 'json',
			});

			fs.writeFileSync(
				directory + '/' + fileName,
				formattedContents,
				'utf8'
			);
		}
	}

	console.log('Conversion of translation files completed');
}
