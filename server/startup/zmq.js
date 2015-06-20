
/*jslint node: true */
'use strict';

var getQueue = global.rootRequire('server/common/logging/get_queue');
// Configure and get the custom loggers for this application
var customLoggerFactory = global.rootRequire('server/common/logging/get_winstonlogger');

(function (zmq) {

    // ZeroMQ is built for each OS so instantiation will need to be conditional
    var zeroMQ = getQueue();

    var logOptions = { dirName : __dirname + '/../..'};

    zmq.getLoggers = function() {

        // Get the event logger for logging messages
        global.eventLogger = customLoggerFactory.getLogger(logOptions).loggers.get('events');
    };

    zmq.init = function () {

        this.getLoggers();

        // Create the log folder
        var fs = require('fs');
        fs.mkdir(__dirname + '/../../log', function() { } );

        // WARNING - The following code should be set only for DEV/TEST environment if there is not
        // a valid certificate for TLS/SSL
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

        // For the PoC, a worker process is required only if there will be queued logging
        if (zeroMQ)
        {
            var zmqOptions = {
                port: global.appsettings.queuedMessagePort,
                level: 'verbose',
                zmq: zeroMQ
            };
            // Put the logger instance into the app so that it is accessible to all requests.
            var qlogger = customLoggerFactory.getLogger(logOptions, zmqOptions);

            if (!qlogger) {
                throw new Error('Unable to create queued logger');
            }
        }
    };

    zmq.listen = function () {

        // Bind to the ZeroMQ socket
        var sock = zeroMQ.socket('pull');
        sock.connect('tcp://127.0.0.1:' + global.appsettings.queuedMessagePort);

        sock.on('message', function(msg) {
            var payload = JSON.parse(msg);
            global.eventLogger.log(payload.level, payload.message, payload.meta);
        });
    };

}(module.exports));
