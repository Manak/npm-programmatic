const Promise = require('bluebird');
const exec = require('child_process').exec;

module.exports = {
	install: function(packages, opts){
		if(packages.length == 0 || !packages || !packages.length){Promise.reject("No packages found");}
		if(!opts) opts = {};
		var cmdString = "npm install " + packages.join(" ") + " "
						+ (opts.global ? " -g":"")
						+ (opts.save   ? " --save":"")
						+ (opts.saveDev? " --saveDev":"");

		return new Promise(function(resolve, reject){
			exec(cmdString, {cwd: opts.cwd?opts.cwd:"/"},(error, stdout, stderr) => {
			  if (error) {
			  	reject(error);
			  } else {
			  	resolve(true);
			  }
			});
		});
	}
}