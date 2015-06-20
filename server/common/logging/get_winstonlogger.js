'use strict';

var winston = require('winston');
var zmqTransport = require('./zeromq_winstontransport');

function getLogger(logOptions, zmqOptions) {
    //var loggingLevels = {
    //	levels: {
    //		trace: 0,
    //		debug: 1,
    //		info: 2,
    //		warn: 3,
    //		error: 4,
    //		fatal: 5,
    //		ignore: 6
    //	},
    //	colors : {
    //		trace: 'green',
    //		debug: 'blue',
    //		info: 'magenta',
    //		warn: 'yellow',
    //		error: 'red',
    //		fatal: 'red'
    //	}
    //};
    // If zmq != null ==> that there is a need to use a queued logger.
    // As of this version, a queued looger can be the only transport used with a logger
    // Along with the zmq instance, a port should be supplied as well.  If not a default port will be used
    // zmqoptions = { zmq: instance, port: xxxx, level : base level for logging, logger: Winston logger for queue listener to use when persisting messages}
    if (zmqOptions != null)
    {
        var Trzmq = zmqTransport.Zmq;
        var trzmqOptions = { port: zmqOptions.port || 3010,
            level: zmqOptions.level || 'verbose',
            logger: zmqOptions.logger || 'events'
        };
        var transports = {};
        transports.Zmq = new Trzmq(trzmqOptions, zmqOptions.zmq);
        return new (winston.Logger)({
            transports: [transports.Zmq]
        });

    }

    winston.loggers.add('events', {
        file: {
            level: 'info',
            filename: logOptions.dirName + '/log/apsEvents.log',
            maxsize: 1024 * 1024 * 10, // 10MB
            tailable: true
        }
    });
    // Remove the console logger from the 'events' logger
    try
    {
        winston.loggers.get('events').remove(winston.transports.Console);
    }
    catch (e) {}
    return winston;
}

module.exports.getLogger = getLogger;
