# npm-programmatic

npm-programmatic is a library that allows you to access npm commands programmatically from javascript
## Usage
Every function returns a Bluebird promise.   
CWD refers to current working directory, allowing you to ensure the command executes in a certain folder in the filesystem.

## Installation of Packages

``` 
    npm.install(packages, opts).then(function)
```
| Name        | Type           | Value  |
| ------------- |:-------------:| -----:|
| packages      | Array      |   packages to be installed |
| opts      | Object | save:true/false; global:true/false; cwd:string; saveDev:true/false|

### Example
``` 
    var npm = require('npm-programmatic');
    npm.install(['left-pad'], {
        cwd:'/path/to/my/project',
        save:true
    })
    .then(function(){
        console.log("SUCCESS!!!");
    })
    .catch(function(){
        console.log("Unable to install package");
    });
```


## Tests
install mocha and dev dependencies. Then run 
``` npm test    ```
