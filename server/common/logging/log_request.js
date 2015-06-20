'use strict';

var getRequestLoggingItems = global.rootRequire('server/common/logging/get_requestlogging_items');
var getClientLoggingItems = global.rootRequire('server/common/logging/get_clientlogging_items');

function logRequest(logOptions) {

    var logItems = (logOptions.isClientLogging) ?
        getClientLoggingItems(logOptions.req) :
        getRequestLoggingItems(logOptions.req, logOptions.process);

    if (logOptions.customLogItems) {
        logOptions.customLogItems.forEach(function(customItem) {
            logItems[customItem] = logOptions.customLogItems[customItem];
        });
    }

    logOptions.logger.log(logOptions.level || 'info', logOptions.logType || 'webRequest', logItems);
}

logRequest.mixin = function(destObject) {
    ['logRequest'].forEach(function(property){
        destObject.prototype[property] = logRequest.prototype[property];
    });
};

module.exports = logRequest;