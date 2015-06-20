/*

 Handles errors and logs error messages. Redirects to error page after error logged, passing in the token
 generated for the error log.

 */

'use strict';

var errorLogMessage = global.rootRequire('server/common/logging/errorlog_message');
var errorLogItems = global.rootRequire('server/common/logging/get_errorlogging_items');
var randToken = require('rand-token');
var util = require('util');

function mwErrorHandler(err, req, res, next) {

    if (err) {

        var randtoken = randToken.generator({
            chars: 'A-Z'
        });

        // generate a 8 character token to differentiate from .net implementation
        var token = randtoken.generate(8);

        err.token = token;

        // can format error message here.
        var errorMessage = errorLogMessage(err, { req : req });
        var logItems = errorLogItems(err, { req : req, process : process });

        // log error
        global.eventLogger.log('error', errorMessage, logItems);

        // For easy debugging during development
        if (process.env.NODE_ENV === 'local') {
            console.log(err);
        }

        // redirect to default error page.
        res.redirect(util.format('/Error/Unknown?token=%s', token));

        res.end();
        if (err.domain) // If this is an uncaught exception assume application is unstable
        {
            req.app.set('isShuttingDown', true);  // Set shutting down flag
            // The server.close() method will wait for all connections to close
            // This allows for a graceful shutdown and then a process end
            req.app.server.close(function(){
                process.end(1);
            });
        }
    }

    if (next) { next(); }

}

module.exports = mwErrorHandler;