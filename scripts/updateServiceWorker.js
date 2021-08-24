/* eslint-disable quotes */
const fs = require('fs');
const path = require('path');
const buildFolder = path.relative(process.cwd(), 'build');
const publicFolder = path.relative(process.cwd(), 'public');

fs.readFile(
	publicFolder + '/service-worker.js',
	'utf8',
	(swError, swFileData) => {
		let key;
		var base;
		var baseString;

		let routesString;
		let routesStringComplete;

		let routeConfig;
		let assetManifest;

		if (swError) {
			return console.log(swError);
		}

		if (swFileData) {
			routeConfig = require(path.resolve(
				path.relative(process.cwd(), 'src')
			) + '/route-config.json');

			assetManifest = require(path.resolve(
				path.relative(process.cwd(), 'build')
			) + '/asset-manifest.json');

			base = process.env.SW_BASE;
			baseString = "var base = '" + base + "';";

			routesString = 'var cache = [';
			routesStringComplete = 'var cacheComplete = [';

			routesString += "'" + base + "',";
			routesStringComplete += "'" + base + "',";

			for (key in routeConfig) {
				if (routeConfig[key].path === '/') {
					routesString += "'" + base + routeConfig[key].path + "',";
					routesStringComplete +=
						"'" + base + routeConfig[key].path + "',";
				} else {
					routesString += "'" + base + routeConfig[key].path + "/',";
					routesStringComplete +=
						"'" + base + routeConfig[key].path + "/',";
				}
			}

			for (key in assetManifest.files) {
				if (key.indexOf('index.html') === -1) {
					routesStringComplete +=
						"'" + base + assetManifest.files[key] + "',";
				}
			}

			routesString = routesString.slice(0, -1) + '];';
			routesStringComplete = routesStringComplete.slice(0, -1) + '];';

			swFileData = swFileData.replace(/var base;/g, baseString);
			swFileData = swFileData.replace(/var cache;/g, routesString);
			swFileData = swFileData.replace(
				/var cacheComplete;/g,
				routesStringComplete
			);

			fs.writeFile(
				buildFolder + '/service-worker.js',
				swFileData,
				'utf8',
				function (writeError) {
					if (writeError) {
						return console.log(writeError);
					}

					return console.log('ServiceWorker update completed');
				}
			);
		}
	}
);
