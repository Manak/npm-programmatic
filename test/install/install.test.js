var npm = require("../../index");
var fs = require("fs");
var exec = require('child_process').exec,child;
var chai = require('chai');
var chaiFiles = require('chai-files');

chai.use(chaiFiles);

var expect = chai.expect;
var dir = chaiFiles.dir;

describe("Test installation of packages", ()=>{
	beforeEach(()=>{
		child = exec('rm -rf ./node_modules/left-pad',function(err,out) {});
		child = exec('cp ./package.json ./test/backup/package.json',function(err,out) {});
	});
	afterEach(()=>{
		child = exec('rm -rf ./node_modules/left-pad',function(err,out) {});
		child = exec('cp ./test/backup/package.json ./package.json' ,function(err,out) {});
	});

	it("should install package", function() {
		this.timeout(5000);
		return npm.install(["left-pad"], {cwd:'.'}).then(() => {
			expect(dir('node_modules/left-pad')).to.exist;
		});
	});

	it("should install package inside a node project and save it to package.json", function() {
		this.timeout(5000);
		npm.install(["left-pad"], {cwd:'.', save:true}).then(() => {
			expect(dir('node_modules/left-pad')).to.exist;

			var contents = require('../../package.json');
			expect(contents.dependencies).to.have.property('left-pad');
		});
	});
});
