
/*jslint node: true */
'use strict';

var zmq = global.rootRequire('server/startup/zmq');
var webWorker = global.rootRequire('server/startup/webworker');
var zmqWorker = global.rootRequire('server/startup/zmqworker');
var packageJson = require('../../package.json');

module.exports = (function() {

    var cluster = require('cluster');

    // Cache all the workers
    var workers = {};

    var createWorker = function(workerName) {

        var newWorker = cluster.fork({ WORKER_NAME : workerName });

        workers[newWorker.id] = workerName;

        return newWorker;
    };

    return {

        init : function() {

            var debug = false;

            // If in debug mode, run web process on the master
            // and spawn zmq listener on the worker
            if(process.execArgv.length > 2) {
                debug = (process.execArgv[0].indexOf('--debug') === 0);
            }

            if (cluster.isMaster) {

                var env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

                global.appsettings = global.rootRequire('server/common/config/load_yamlconfig')({
                    environment : env,
                    fileNames : ['./server/startup/config.yaml', './server/startup/config.local.yaml']
                });

                // Get the product version from package.json
                global.appsettings.productVersion = packageJson.version;

                // Zmq initialization
                zmq.init();

                if(debug) {
                    // Start the web process on master
                    webWorker();
                } else {


                    // limit to a single thread for page rendering
                    // In the future this could be reverted back to a loop so that multiple
                    // worker threads could be created.
                    createWorker('webworker').send({ appsettings: global.appsettings });
                }

                // Create the zmq worker
                createWorker('zmqworker').send({ appsettings: global.appsettings });

                // Listen for dying workers
                cluster.on('exit', function (worker, code, signal) {
                    // Replace the dead worker
                    var workerName = workers[worker.id];

                    delete workers[worker.id];

                    createWorker(workerName).send({ appsettings: global.appsettings });
                });

                // Listen for new workers
                cluster.on('online', function(worker) {
                    var workerName = workers[worker.id];
                });
            }

            if(cluster.isWorker) {

                // Zmq initialization
                zmq.getLoggers();

                // Create the web worker
                if(!debug) {
                    if(process.env.WORKER_NAME === 'webworker') {

                        process.on('message', function(msg) {
                            global.appsettings = msg.appsettings;

                            // Start the web worker process
                            webWorker();
                        });
                    }
                }

                // Create the ZMQ worker
                if(process.env.WORKER_NAME === 'zmqworker') {

                    process.on('message', function(msg) {
                        global.appsettings = msg.appsettings;

                        // Start the zmq listener in the worker process
                        zmqWorker();
                    });

                }

            }

        }

    };

}());
