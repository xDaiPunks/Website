var exec = require('child_process').exec;

exec('node-sass-chokidar -q ./src/ -o ./src/', function(error, stdout, stderr) {
	if (error) {
		console.log('node-sass: error');
		console.log(error);
	} else {
		console.log('node-sass: css file generated');
	}
});
