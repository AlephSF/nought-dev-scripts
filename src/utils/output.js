const output = (process) => {
	process.stdout.on('data', function (data) {
		console.log(data.toString());
	});
	
	process.stderr.on('data', function (data) {
		console.log(data.toString());
	});
	
	process.on('exit', function (code) {
		console.log('child process exited with code ' + code.toString());
	});
}

export default output