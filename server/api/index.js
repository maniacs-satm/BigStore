'use strict';

var express =  require('express');

// initialize dependencies to be injected into controller and dependent modules;
var dependencies = require('./dependencies');

// create controller.
var apiController = (require('./controller'))({dependencies: dependencies});

function api(app) {

    // create the billing sub app.
    var apiApp = express();

    // inject middleware
    var middleware = global.rootRequire('server/common/middleware');

    apiController.init(apiApp, middleware);

    // return 404 for page not found, reverse proxy will route to not found error page.
    apiApp.get('*', function(req, res){
        res.status(404).send('404: Page not Found');
    });

    // mount the sub app
    app.use('/api', apiApp);

}

module.exports = api;