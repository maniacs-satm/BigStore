'use strict';
function getRequestLoggingItems(req, process)
{
    var logItems = {};
    logItems.logType = 'webRequest';
    logItems.level = 'info';
    logItems.logSource = 'server';

    if (req.startTime) {
        logItems.startTime = req.startTime;
        logItems.startTimeDisplay = req.startTimeDisplay;
    }
    else
    {
        logItems.startTime = process.hrtime();
        logItems.startTimeDisplay = new Date();
    }

    var endTime = process.hrtime(logItems.startTime);
    logItems.endTime = endTime;
    logItems.endTimeDisplay = new Date();
    logItems.elapsedTime = endTime[1] / (1024 * 1024);
    logItems.id = req.requestId;
    logItems.transactionId = req.requestId;
    logItems.httpType = req.route ?
        req.route.stack[0].method :
        'unk';
    logItems.hostname = req.hostname;
    logItems.serverName = process.env.HOST;
    logItems.productVersion = global.appsettings.productVersion;
    logItems.baseUrl = req.baseUrl;
    logItems.path = req.path;
    logItems.originalUrl = req.originalUrl;
    logItems.params = req.params;
    logItems.protocol = req.protocol;
    logItems.query = req.query;
    logItems.body = JSON.stringify(req.body);
    logItems.sessionId = req.SessionID;
    logItems.isError = req.isError;
    logItems.referrerUrl = req.get('Referrer');
    logItems.browserType = req.headers['user-agent'];
    logItems.requestIp = req.ip;
    logItems.xForwardedForIp = JSON.stringify(req.ips);
    logItems.cookies = req.cookies;
    logItems.sessionId = req.sessionID;
    logItems.session = req.session;

    return logItems;
}

module.exports = getRequestLoggingItems;