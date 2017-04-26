var npm = require("../../index");

describe("Test searching for packages", ()=>{
	it("should find the 'left-pad' module.", function(done){
		this.timeout(120000);
		npm.search('left-pad')
		.then(function(packages){
			if(packages.length < 1){
				return done(new Error('No packages found.'));
			}
      return done();
		})
		.catch(function(err){
			return done(err);
		})
	});
});
