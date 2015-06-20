/**
 Formats an error message for logs
 */
'use strict';

var util = require('util');

function errorlogMessage(err, data) {
    var logEntry = '';

    // server info
    logEntry += 'Application Info ';
    logEntry += 'Application: BigStore ';
    logEntry += util.format('Process Directory: %s ', process.execPath);
    logEntry += util.format('Environment: %s ', process.env.NODE_ENV);
    logEntry += util.format('Architecture: %s ', process.arch);
    logEntry += util.format('Platform: %s ', process.platform);
    logEntry += util.format('Startup Args: %s ', process.argv);
    logEntry += util.format('Node Version: %s ', process.version);
    logEntry += util.format('Node Dependencies: %s ', JSON.stringify(process.versions));
    logEntry += util.format('Node Configurations: %s ', JSON.stringify(process.config));
    logEntry += util.format('Memory Usage: %s ', JSON.stringify(process.memoryUsage()));
    logEntry += util.format('Process ID: %s  ', process.pid);

    // error message and stack
    logEntry += util.format('Error Info ');
    logEntry += util.format('Error Token: %s ', err.token);
    logEntry += util.format('Error Message: %s ', err.message);
    logEntry += util.format('Error Stack: %s  ', err.stack);

    // request info
    if (data.req) {
        logEntry += util.format('Request Info ');
        logEntry += util.format('Full URL: %s%s%s ', data.req.hostname, data.req.baseUrl, data.req.path);
        logEntry += util.format('Server Name: %s ', data.req.hostname);
        logEntry += util.format('Script Name: %s%s ', data.req.baseUrl, data.req.path);
        logEntry += util.format('Querystring: %s ', JSON.stringify(data.req.query));
        if (data.req.body) {
            logEntry += util.format('Post Body: %s ', JSON.stringify(data.req.body));
        }
        logEntry += util.format('Referrer URL: %s ', data.req.get('Referrer'));
        logEntry += util.format('Browser Type: %s ', data.req.headers['user-agent']);
        logEntry += util.format('Remote IP: %s ', data.req.ip);
        logEntry += util.format('X-Forwarded-For IP: %s ', JSON.stringify(data.req.ips));
        logEntry += util.format('Cookies: %s  ', JSON.stringify(data.req.cookies));
    }

    return logEntry;
}

module.exports = errorlogMessage;