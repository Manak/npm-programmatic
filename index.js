const Promise = require('bluebird');
/* Should use execFile instead of exec, since it does not run using the shell and should not be susceptible to malicious user input (command injection). */
const execFile = require('child_process').execFile;

/* For execFile to work with npm in Windows, npm.cmd should be called. */
const cmdFile = (/^win/.test(process.platform)) ? "npm.cmd" : "npm";

module.exports = {
	install: function(packages, opts){
		if(packages.length == 0 || !packages || !packages.length){return Promise.reject("No packages found");}
		if(typeof packages == "string") packages = [packages];
		if(!opts) opts = {};
		var cmdArgs = [];
    cmdArgs.push("install");
    for (package in packages) {
      cmdArgs.push(packages[package]);
    }
		opts.global && cmdArgs.push("-g")
    cmdArgs.push(opts.save ? "--save" : "--no-save");
		opts.saveDev && cmdArgs.push("--save-dev")
		opts.legacyBundling && cmdArgs.push("--legacy-bundling")
		opts.noOptional && cmdArgs.push("--no-optional")
		opts.ignoreScripts && cmdArgs.push("--ignore-scripts")
    
		return new Promise(function(resolve, reject){
			var cmd = execFile(cmdFile, cmdArgs, {cwd: opts.cwd?opts.cwd:"/", maxBuffer: opts.maxBuffer?opts.maxBuffer:200 * 1024},(error, stdout, stderr) => {
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
		if(packages.length == 0 || !packages || !packages.length){return Promise.reject(new Error("No packages found"));}
		if(typeof packages == "string") packages = [packages];
		if(!opts) opts = {};

    var cmdArgs = [];
    cmdArgs.push("uninstall");
    for (package in packages) {
      cmdArgs.push(packages[package]);
    }
		opts.global && cmdArgs.push("-g")
		cmdArgs.push(opts.save ? "--save" : "--no-save");
		opts.saveDev && cmdArgs.push("--save-dev")
    
		return new Promise(function(resolve, reject){
			var cmd = execFile(cmdFile, cmdArgs, {cwd: opts.cwd?opts.cwd:"/"},(error, stdout, stderr) => {
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
		var cmdArgs = ["ls", "--depth=0"];
    global && cmdArgs.push("-g");
		return new Promise(function(resolve, reject){
			execFile(cmdFile, cmdArgs, {cwd: path?path:"/"},(error, stdout, stderr) => {
				if(stderr !== ""){
					if (stderr.indexOf("missing")== -1 && stderr.indexOf("required") == -1) {
						return reject(error);
					}
				}
				var packages = [];
				packages = stdout.split('\n');
				packages = packages.filter(function(item){
					if(item.match(/^(\+|`)--.+/g) != null){
						return true
					}
					return undefined;
				});
				packages = packages.map(function(item){
					if(item.match(/^(\+|`)--\s.+/g) != null){
						return item.replace(/^(\+|`)--\s/g, "");
					}
				})
				resolve(packages);

			});
		});
	}
}
