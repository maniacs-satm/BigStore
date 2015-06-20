/**
 * Created by va7941 on 12/8/2014.
 */

/*jslint node: true */
'use strict';

var compression = require('compression');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var path = require('path');
var serveStatic = require('serve-static');

module.exports = function(app) {

    // Use compress middleware to gzip content
    app.use(compression());

    app.disable('etag');

    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(require('express-domain-middleware')); // Use domain middleware to process un-caught exceptions at the Domain level
                                                   // Domain errors will be processed by the express error processing module (next(error))

    // Enabling CORS (To be reviewed)
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    // wire up root
    app.use('/', serveStatic(path.normalize('./dist')));

    if (process.env.NODE_ENV === 'local') {
        app.set('view cache', false);

    } else {
        app.set('view cache', true);
    }

};
