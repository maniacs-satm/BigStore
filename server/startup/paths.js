
/*jslint node: true */
'use strict';

module.exports = function(global) {

    var path = require('path');

    // Create the root path for dependencies
    global.rootRequire = function(name) {
        var fileLocation = __dirname + '/../../' + name;
        var fileInfo = path.normalize(__dirname + '/../../' + name);

        if (!fileInfo) {
            throw new Error('Cannot load module at path ' + fileLocation);
        }

        return require(fileInfo);
    };

};
