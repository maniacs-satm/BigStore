'use strict';

var _logRequest = global.rootRequire('server/common/middleware/log_request');

function mwClientLogger(req, res) {

    req.requestId = require('node-uuid').v4();

    if (req.body) {
        _logRequest({
            req : req,
            res : res,
            isClientLogging : true,
            level : req.body.level,
            logType : req.body.logType
        });
    }

    res.send(true);

}

module.exports = mwClientLogger;