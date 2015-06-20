
/*jslint node: true */
'use strict';

var zmq = global.rootRequire('server/startup/zmq');

module.exports = function() {

    // Start the zmq listener in the worker process
    zmq.listen();

};