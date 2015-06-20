'use strict';

var _logRequest = global.rootRequire('server/common/logging/log_request');
var extend = require('extend');

function mwLogRequest(options) {

    var moreOptions =  extend(true, {
        process : process,
        logger : global.eventLogger
    }, options);

    _logRequest(moreOptions);

}

module.exports = mwLogRequest;