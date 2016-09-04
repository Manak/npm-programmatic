var npm = require("../../index");
var fs = require("fs");
var exec = require('child_process').exec,child;
var chai = require('chai');
var chaiFiles = require('chai-files');

chai.use(chaiFiles);

var expect = chai.expect;
var dir = chaiFiles.dir;

describe("Test uninstallation of packages", ()=>{
	beforeEach(()=>{
		child = exec('cp -R ./node_modules/bluebird ./test/backup/node_modules/bluebird',function(err,out) {
		});
		child = exec('cp ./package.json ./test/backup/package.json',function(err,out) {});
	});

	afterEach(()=>{
		child = exec('cp -R ./test/backup/node_modules/bluebird ./node_modules/bluebird ',function(err,out) {
		});
		child = exec('cp ./test/backup/package.json ./package.json' ,function(err,out) {});
	});
	

	it("should uninstall package", function(done){
		this.timeout(5000);
		npm.uninstall('bluebird', {cwd:"."})
		.then(function(status){
			expect(dir('node_modules/bluebird')).to.not.exist;
			done();
		})
		.catch(function(err){
			done(err);
		});
	});

	it("should uninstall package inside a node project and save it to package.json", function(done){
		this.timeout(5000);
		npm.uninstall('bluebird', {cwd:'.', save:true}).then(()=>{
			expect(dir('node_modules/bluebird')).to.not.exist;

			try{
				var contents = fs.readFileSync('./package.json','UTF-8');
				contents = JSON.parse(contents);
				if(contents.dependencies['bluebird']){
					return done(new Error());
				}
				done();
			} catch(err){
				return done();
			}
		}).catch((err)=>{
			return done(err);
		});
	});

});
