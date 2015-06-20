
'use strict';

var requestLoggingItems = global.rootRequire('server/common/logging/get_requestlogging_items');

function getErrorLoggingItems(err, errOptions){

    var logItems = requestLoggingItems(errOptions.req, errOptions.process);
    logItems.logType = 'error';
    logItems.level = 'error';
    logItems.logSource = 'server';

    // server info
    logItems.processDirectory = errOptions.process.execPath;
    logItems.environment = errOptions.process.env.NODE_ENV;
    logItems.architecture = errOptions.process.arch;
    logItems.platform = errOptions.process.platform;
    logItems.startupArgs = errOptions.process.argv;
    logItems.nodeVersion = errOptions.process.version;
    logItems.nodeDependencies = JSON.stringify(errOptions.process.versions);
    logItems.nodeConfigurations = JSON.stringify(errOptions.process.config);
    logItems.memoryUsage = JSON.stringify(errOptions.process.memoryUsage());
    logItems.processIs = errOptions.process.pid;

    // error message and stack
    logItems.errorToken = err.token;
    logItems.errorMessage = err.message;
    logItems.errorStack = err.stack;

    return logItems;
}

module.exports = getErrorLoggingItems;