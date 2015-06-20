/**
 * Created by va7941 on 12/16/2014.
 */

/*jslint node: true */
'use strict';

var express = require('express');
var expressConfig = global.rootRequire('server/startup/express');
var requestValues = global.rootRequire('server/common/middleware/initialize_request_values');
var errorHandler = global.rootRequire('server/common/middleware/error_handler');

module.exports = function() {

    var app = express();


    // The following code block will override the standard response.end method so that each request
    // is logged.  Response.end() must be invoked as part of the express framework
    // Review of the node_modules/express/lib/response.js module reveals that at most, end() is invoked with two values.
    // Care should be taken in the future to ensure that if the response module changes to include an end() method call
    // with additional parameters that this signature is changes.
    app.response.__proto__._ypend = app.response.__proto__.end;

    app.response.__proto__.end = function(var1, var2)
    {

        this.emit('beforeEnd', this.req, this.res);
        this._ypend(var1, var2);
    };

    if (global.appsettings.longStack) {
        require('longjohn');
    }

    // Express configuration
    expressConfig(app);

    // force any doNotLog filters to lowerCase
    if (global.appsettings && global.appsettings.doNotLog && global.appsettings.doNotLog.length > 0) {
        global.appsettings.doNotLog.forEach(function (path, index) {
            global.appsettings.doNotLog[index] = global.appsettings.doNotLog[index].toLowerCase();
        });
    }

    // Add in middleware that will assign a uuid to the request and set up timing parameters
    app.use(requestValues);

    // Initialize the routes in the controller
    global.rootRequire('server/api')(app);

    app.get('/', function(req, res){
        res.end();
    });


    // wire up global error handler - this should always be called last.
    app.use(errorHandler);

    var appPort = global.appsettings.appPort;

    app.listen(appPort, function() {
        console.log('HTTP server started at port ' + appPort);
    });

};
