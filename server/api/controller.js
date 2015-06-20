
/*jslint node: true */
'use strict';

var errorLogMessage = global.rootRequire('server/common/logging/errorlog_message');
var errorLogItems = global.rootRequire('server/common/logging/get_errorlogging_items');

var request = require('request');

function controller(opts) {

    var getProducts = function(req, res, next) {
        opts.dependencies.products.find({"id":req.params.id}, function(err, products){
            res.json(products);
        });
    };

    return {

        // root of app is /api
        init : function (app, middleware) {

            app.get('/products/:id', getProducts);

        }

    };

}

module.exports = controller;