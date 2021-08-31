const path = require('path');
const fs = require('fs-extra');


const buildDirectory = path.resolve(
	'/Users/Mac/Projects/Nodejs/Punks/xDaiPunks/build'
);
const serverDirectory = path.resolve(
	'/Users/Mac/Projects/Nodejs/Punks/xDaiPunks-Server/public'
);

const webTemplateDirectory = path.resolve(
	'/Users/Mac/Projects/Nodejs/Punks/xDaiPunks-Server/app/webTemplates'
);

console.log(path.resolve(webTemplateDirectory));

copy();

function copy() {
	fs.copy(buildDirectory, serverDirectory)
		.then(() => {
			console.log('Files copied successfully');
			generateTemplates();
		})
		.catch((error) => console.error(error));
}

function generateTemplates() {
	const indexContent = fs.readFileSync(serverDirectory + '/index.html', {
		encoding: 'utf8',
	});

	fs.writeFileSync(webTemplateDirectory + '/app.html', indexContent);
	fs.unlinkSync(serverDirectory + '/index.html');

	console.log('All build files written to server repository');
}
