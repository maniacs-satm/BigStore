/*jslint node: true */
'use strict';

// Set the paths to locate local and common modules
require('./startup/paths')(global);

// Set up the master and worker processes
require('./startup/cluster').init();
