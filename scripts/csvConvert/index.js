/* eslint-disable prefer-const */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-shadow */
/* eslint-disable no-useless-return */
/* eslint-disable operator-assignment */
/* eslint-disable no-console */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable guard-for-in */

/* eslint-disable func-names */
/* eslint-disable consistent-return */
/* eslint-disable object-shorthand */

let options;
let filePath;
let extension;
let fileStringAbsolute;

let fileObject = {};

const fs = require('fs');
const glob = require('glob');
const path = require('path');

const events = require('events');

const ProcessCSV = require('./lib/ProcessCSV');

const eventEmitter = new events.EventEmitter();

class CsvConvert {
	constructor() {
		this.events = eventEmitter;
	}

	convert(fileString) {
		fileObject = {};

		if (!fileString || fileString.trim() === '') {
			eventEmitter.emit('error', 'Error: no input');
			return;
		}

		// check for wildcards
		if (fileString.indexOf('*') !== -1) {
			fileStringAbsolute = path.resolve(fileString);

			glob(fileStringAbsolute, options, function (error, files) {
				if (error) {
					eventEmitter.emit('error', 'node-csv: could not read files');
					return;
				}

				generateFilePaths(files);
			});
		} else {
			fileStringAbsolute = path.resolve(fileString);

			fs.readdir(fileStringAbsolute, function (error, files) {
				if (error) {
					eventEmitter.emit('error', 'node-csv: could not read files');
					return;
				}

				if (
					fileStringAbsolute.substr(
						fileStringAbsolute.length - 1,
						fileStringAbsolute.length
					) !== '/'
				) {
					fileStringAbsolute = fileStringAbsolute + '/';
				}

				for (let i = 0; i < files.length; i++) {
					files[i] = fileStringAbsolute + files[i];
				}

				generateFilePaths(files);
			});
		}

		function getOptions(optionsObject) {
			let defaultOptions = {
				parserOptions: {
					delimiter: ';',
					auto_parse: true
				},
				processValue: function (key, value) {
					if (key !== '') {
						return value;
					}
				}
			};

			if (!optionsObject || typeof optionsObject !== 'object') {
				return defaultOptions;
			}

			for (let option in optionsObject) {
				defaultOptions[options] = optionsObject[option];
			}

			return defaultOptions;
		}

		function generateFilePaths(files) {
			if (files.length === 0) {
				eventEmitter.emit('error', 'node-csv: no files found');
				return;
			}

			for (let i = 0; i < files.length; i++) {
				filePath = files[i];
				extension = path.extname(filePath);
				if (extension === '.csv') {
					fileObject[path.basename(filePath, path.extname(filePath))] = {
						processed: false,
						filePath: filePath
					};
				}
			}

			if (Object.keys(fileObject).length === 0) {
				eventEmitter.emit('error', 'node-csv: no files processed');
				return;
			}

			for (let fileID in fileObject) {
				processFileContents(fileObject[fileID].filePath);
			}
		}

		function processFileContents(filePath, optionsObject) {
			fs.readFile(filePath, 'utf8', function (readError, readFileData) {
				let options = getOptions(optionsObject);

				if (readError) {
					eventEmitter.emit('error', readError);
					return;
				}

				ProcessCSV.process(readFileData, options, function (
					processError,
					processResults
				) {
					if (processError) {
						eventEmitter.emit('error', processError);
						return;
					}

					processResults.forEach(function (set) {
						let contents = Buffer.from(JSON.stringify(set.data), 'utf8');

						let fileDirectory = path.dirname(filePath);
						let fileNameWithoutExtension = path.basename(
							filePath,
							path.extname(filePath)
						);

						fs.writeFile(
							fileDirectory + '/' + fileNameWithoutExtension + '.json',
							contents,
							{
								flag: 'w+',
								encoding: 'utf-8'
							},
							function (writeError) {
								if (writeError) {
									eventEmitter.emit('error', writeError);
									return;
								}

								let processOperationFinished = true;

								fileObject[fileNameWithoutExtension].processed = true;

								for (let processedfileID in fileObject) {
									if (fileObject[processedfileID].processed === false) {
										processOperationFinished = false;
									}
								}

								if (processOperationFinished === true) {
									eventEmitter.emit(
										'success',
										'JSON file conversion completed'
									);
								}
							}
						);
					});
				});
			});
		}
	}
}

module.exports = CsvConvert;
