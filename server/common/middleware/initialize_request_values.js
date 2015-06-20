'use strict';

var _logRequest = global.rootRequire('server/common/middleware/log_request');
var _string = require('underscore.string');

function mwInitializeRequestValues(req, res, next)
{
    // Check to see if no processing for selected path
    var log = true;
    if (global.appsettings && global.appsettings.doNotLog && global.appsettings.doNotLog.length > 0) {
        var reqpath = req.path.toLowerCase();
        // appsetting.doNotLog is forced to lowerCase in cluster.js
        global.appsettings.doNotLog.every(function(path) {
            if(_string.startsWith(reqpath, path)) {
                log = false;
                return false;
            }
            return true;
        });
    }

    // If log is false, then the current request will not create an event handler
    // to complete the logging
    if (log) {
        req.requestId = require('node-uuid').v4();
        req.startTime = process.hrtime();
        req.startTimeDisplay = new Date();

        // Set the performance attributes, which is sent to the client, along with the model data
        res.locals.perfModel = {
            clientLogging : global.appsettings.clientLogging,
            originalUrl : req.originalUrl,
            parentId : req.requestId,
            sessionId : req.sessionID,
            serverStartTime : req.startTimeDisplay.getTime()
        };

        // this is wired up in webworker.
        res.on('beforeEnd', function (req) {
            // If for some reason logging is not required, set the
            // req.noLog property = true.
            if (!req.noLog) {
                _logRequest({
                    req : req,
                    res : res,
                    isClientLogging : false,
                    level : 'info',
                    logType : 'webRequest'
                });
            }
        });
    }

    next();
}

module.exports = mwInitializeRequestValues;