const Promise = require('bluebird');
const exec = require('child_process').exec;

module.exports = {
	execute: function( cmdString, options, callback ){
		if ( callback !== undefined ){
			callback = (error, stdout, stderr) => {
				if (error) {
					reject(error);
				} else {
					resolve(true);
				}
			}
		}
		
		return new Promise(function(resolve, reject){
			var cmd = exec(cmdString, options, callback);

			if( options.output ) {
				var consoleOutput = function(msg) {
					console.log('npm: ' + msg);
				};
				
				cmd.stdout.on('data', consoleOutput);
				cmd.stderr.on('data', consoleOutput);
			}
		});
	},
	install: function(packages, opts){
		if(packages.length == 0 || !packages || !packages.length){Promise.reject("No packages found");}
		if(typeof packages == "string") packages = [packages];
		if(!opts) opts = {};
		var cmdString = "npm install " + packages.join(" ") + " "
		+ (opts.global ? " -g":"")
		+ (opts.save   ? " --save":"")
		+ (opts.saveDev? " --saveDev":"");

		return this.execute( cmdString, {cwd: opts.cwd?opts.cwd:"/", output: opts.output} );
	},

	uninstall: function(packages, opts){
		if(packages.length == 0 || !packages || !packages.length){Promise.reject(new Error("No packages found"));}
		if(typeof packages == "string") packages = [packages];
		if(!opts) opts = {};
		var cmdString = "npm uninstall " + packages.join(" ") + " "
		+ (opts.global ? " -g":"")
		+ (opts.save   ? " --save":"")
		+ (opts.saveDev? " --saveDev":"");

		return return this.execute( cmdString, {cwd: opts.cwd?opts.cwd:"/", output: opts.output} );
	},

	list:function(path){
		var global = false;
		if(!path) global = true;
		var cmdString = "npm ls --depth=0 " + (global?"-g ":" ");
		return this.execute( cmdString, {cwd: path?path:"/"}, (error, stdout, stderr) => {
			if (stderr.indexOf("missing")== -1 && stderr.indexOf("required") == -1) {
				reject(error);
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

	}
}
