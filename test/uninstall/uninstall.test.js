var npm = require("../../index");
var fs = require("fs");
var should = require("should");
var exec = require('child_process').exec,child;

describe("Test uninstallation of packages", ()=>{
	beforeEach(()=>{
		child = exec('cp -R ./node_modules/left-pad ./test/backup/node_modules/left-pad',function(err,out) {
		});
		child = exec('cp ./package.json ./test/backup/package.json',function(err,out) {});
	});

	afterEach(()=>{
		child = exec('cp -R ./test/backup/node_modules/left-pad ./node_modules/left-pad',function(err,out) {
		});
		child = exec('cp ./test/backup/package.json ./package.json' ,function(err,out) {});
	});


	it("should uninstall package", function(done){
		this.timeout(5000);
		npm.uninstall('left-pad', {cwd:"."})
		.then(function(status){
			try{
				var checkExists = fs.accessSync('./node_modules/left-pad');
			} catch(err){
				return done();
			}
			return done(new Error("Uninstallation failed, package still exists in node_modules."));
		})
		.catch(function(err){
			done(err);
		});
	});

	it("should uninstall package inside a node project and save it to package.json", function(done){
		this.timeout(5000);
		npm.uninstall('left-pad', {cwd:'.', save:true}).then(()=>{
			try{
				var contents = fs.readFileSync('./package.json','UTF-8');
				contents = JSON.parse(contents);
				if(!contents.dependencies['left-pad']){
					var checkExists = fs.accessSync('./node_modules/left-pad');
					return done(new Error());
				}
			} catch(err){
				return done();
			}
		}).catch((err)=>{
			return done(err);
		});
	});

});
