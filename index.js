const Promise = require('bluebird');
const exec = require('child_process').exec;

module.exports = {
	install: function(packages, opts){
		if(packages.length == 0 || !packages || !packages.length){Promise.reject("No packages found");}
		if(typeof packages == "string") packages = [packages];
		if(!opts) opts = {};
		var cmdString = "npm install " + packages.join(" ") + " "
		+ (opts.global ? " -g":"")
		+ (opts.save   ? " --save":"")
		+ (opts.saveDev? " --save-dev":"")
		+ (opts.ignoreScripts? " --ignore-scripts":"");

		return new Promise(function(resolve, reject){
			var cmd = exec(cmdString, {cwd: opts.cwd?opts.cwd:"/", maxBuffer: opts.maxBuffer?opts.maxBuffer:200 * 1024},(error, stdout, stderr) => {
				if (error) {
					reject(error);
				} else {
					resolve(true);
				}
			});

			if(opts.output) {
				var consoleOutput = function(msg) {
					console.log('npm: ' + msg);
				};

				cmd.stdout.on('data', consoleOutput);
				cmd.stderr.on('data', consoleOutput);
			}
		});
	},

	uninstall: function(packages, opts){
		if(packages.length == 0 || !packages || !packages.length){Promise.reject(new Error("No packages found"));}
		if(typeof packages == "string") packages = [packages];
		if(!opts) opts = {};
		var cmdString = "npm uninstall " + packages.join(" ") + " "
		+ (opts.global ? " -g":"")
		+ (opts.save   ? " --save":"")
		+ (opts.saveDev? " --saveDev":"");

		return new Promise(function(resolve, reject){
			var cmd = exec(cmdString, {cwd: opts.cwd?opts.cwd:"/"},(error, stdout, stderr) => {
				if (error) {
					reject(error);
				} else {
					resolve(true);
				}
			});

			if(opts.output) {
				var consoleOutput = function(msg) {
					console.log('npm: ' + msg);
				};

				cmd.stdout.on('data', consoleOutput);
				cmd.stderr.on('data', consoleOutput);
			}
		});
	},

	list:function(path){
		var global = false;
		if(!path) global = true;
		var cmdString = "npm ls --depth=0 " + (global?"-g ":" ");
		return new Promise(function(resolve, reject){
			exec(cmdString, {cwd: path?path:"/"},(error, stdout, stderr) => {
				if(stderr == ""){
					if (stderr.indexOf("missing")== -1 && stderr.indexOf("required") == -1) {
						return reject(error);
					}
				}
				var packages = [];
				packages = stdout.split('\n');
				packages = packages.filter(function(item){
					if(item.match(/^├──.+/g) != null){
						return true
					}
					if(item.match(/^└──.+/g) != null){
						return true
					}
					return undefined;
				});
				packages = packages.map(function(item){
					if(item.match(/^├──.+/g) != null){
						return item.replace(/^├──\s/g, "");
					}
					if(item.match(/^└──.+/g) != null){
						return item.replace(/^└──\s/g, "");
					}
				})
				resolve(packages);

			});
		});
	},

	search: (searchString) => {
		return new Promise((resolve, reject) => {
			if((typeof searchString !== 'string') || (searchString === '')){
				return reject(new Error('Search string must be a string and not empty!'));
			}
			var cmdString = `npm search -l ${searchString}`;
			exec(cmdString, (err, data) => {
				if(err) return reject(err);
				data = data.match(/[^\r\n]+/g);
				var header = data.shift();
				var dataList = data.map((line) =>{
					line = line.split('');
					return {
						name: line.splice(0, header.match(/(NAME *)/g)[0].length).join('').trim(),
						description: line.splice(0, header.match(/(DESCRIPTION *)/g)[0].length).join('').trim(),
						author: line.splice(0, header.match(/(AUTHOR *)/g)[0].length).join('').trim().replace(/=/g, '').split(' '),
						date: line.splice(0, header.match(/(DATE *)/g)[0].length).join('').trim(),
						version: line.splice(0, header.match(/(VERSION *)/g)[0].length).join('').trim(),
						keywords: line.splice(0, header.match(/(KEYWORDS *)/g)[0].length).join('').trim().split(' '),
					};
				});
				for(i = 0; i < dataList.length;) {
					if(dataList[i].name == '' && i !== 0) {
						dataList[i-1].description += ' ' + dataList[i].description;
						dataList[i-1].author += dataList[i].author;
						dataList[i-1].keywords += dataList[i].keywords;
						dataList.splice(i, 1);
					} else {
						i++;
					}
					if(i == dataList.length - 1) return resolve(dataList);
				}
			});
		});
	}
}
