var npm = require("../../index");

describe("Test searching for packages", ()=>{
	it("should find the 'left-pad' module.", function(done){
		this.timeout(120000);
		npm.search('left-pad')
		.then(function(packages){
			console.log(packages);
      return done();
		})
		.catch(function(err){
			return done(err);
		})
	});
});
