'use strict';

function getClientLoggingItems(req) {

    var logItems = {};

    logItems.logType = req.body.logType; // clientError or clientEvent or performance
    logItems.level = req.body.level;  // error or info or performance
    logItems.logSource = 'client';
    logItems.hostname = req.hostname;
    logItems.serverName = process.env.HOST;
    logItems.productVersion = global.appsettings.productVersion;

    // Log errors
    if(logItems.level === 'error') {
        logItems.errorMessage = req.body.message;
        logItems.stackTrace = req.body.stackTrace;
    } else if(logItems.logType === 'clientEvent') {
        // Log events
        logItems.eventMessage = req.body.message;
    } else {
        // Log performance
        logItems.id = req.requestId;
        logItems.transactionId = req.body.parentId;
        logItems.sessionId = req.body.sessionId;
        logItems.originalUrl = req.body.originalUrl;
        logItems.browserType = req.body.browserType;
        logItems.browserVersion = req.body.browserVersion;
        logItems.timingMethod = req.body.timingMethod;
        logItems.unload = req.body.unload;
        logItems.redirect = req.body.redirect;
        logItems.appCache = req.body.appCache;
        logItems.DNS = req.body.DNS;
        logItems.TCP = req.body.TCP;
        logItems.request = req.body.request;
        logItems.response = req.body.response;
        logItems.processing = req.body.processing;
        logItems.onload = req.body.onload;
        logItems.serverTime = req.body.serverTime;
        logItems.clientTime = req.body.clientTime;
        logItems.totalTime = req.body.totalTime;
    }

    return logItems;

}

module.exports = getClientLoggingItems;