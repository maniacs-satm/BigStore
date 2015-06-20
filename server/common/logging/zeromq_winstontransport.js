'use strict';

/*
 * zeromq.js: Transport for outputting to a ZeroMQ socket
 *
 * (C) 2014 ypholdings, llc
 * From winston-mongodb
 * MIT LICENCE
 *
 */

// Custom transport for sending messages to 0MQ.
// The 0MQ listenr will be responsible for persisting messages or sending them
// on to another node (i.e. via LWES)
// Special instructions from the 0MQ listener will be included as part of the metadata passed to the
// logger


var util = require('util');
var winston = require('winston');

//
// ### function ZerpoMQ (options)
// Constructor for the ZeroMQ transport object.
//
var Zmq = exports.Zmq = function (options, zmq) {
    options = options || {};

    if ((!options.transport || options.transport === 'tcp') && !options.port) {
        throw new Error('Cannot log to zmq without a port number (for tcp).');
    }

// Because zmq can vary by OS, give user the option of passing in the correct version
// If a version is not passed in, then instantiate it here from the standard
// npm patch
    if (zmq == null) {
        zmq = require('zmq');
    }

    if (zmq == null) {
        throw new Error('ZeroMQ is not present on the system');
    }
    // Validate the transport
    if (options.transport) {
        if (!(
            options.transport === 'inproc' ||
            options.transport === 'ipc' ||
            options.transport === 'tcp' ||
            options.transport === 'pgm' ||
            options.transport === 'epgm')) {
            throw new Error('Invalid transport option: ' + options.transport);
        }
    }

    if ((options.address && typeof options.address !== 'string') || (options.address && options.address !== '127.0.0.1')) {
        throw new Error('The Address option can only be a string == \'127.0.0.1\'');
    }


    var self = this;

    this.name           = 'zmq';
    this.port           = options.port;
    this.level          = options.level || 'info';
    this.transport      = options.transport || 'tcp'; // default to tcp
    this.state          = 'unbound';
    this.address        = options.address || (this.transport === 'tcp' ?
            '127.0.0.1' :
            '*'); // bind to only '127.0.0.1' for tcp, 'all' for other transports
    this.separator      = options.separator || '|*|';
    this.logger         = options.logger || 'default';
    this.pending        = [];

    // Create a push socket, and bind it to the required port and interface.
    // Because this transport will be bound to a background thread running on the server,
    // the binding will wait until the socket is created.
    // Also, only tcp addresses == '127.0.0.1' will be accepted for this transport.

    this.socket = zmq.socket('push');

    var bindString = this.transport + '://' + this.address;
    if (this.transport === 'tcp') {
        bindString += ':' + this.port;
    }
    var currentPort = this.port;
    this.socket.bind(bindString, function(err) {
        if (err) {
            console.info('queued binding callback error');
            self.state = 'error';
            self.error = err;
        } else {
            console.info('queued binding callback bound to port: ' + currentPort);
            self.state = 'bound';


            if (self.pending.length) {
                var msg;
                while(self.pending.length){
                    msg = self.pending.pop();
                    self.socket.send(msg);
                    self.emit('logged');
                }
            }
        }
    });
};

//
// Inherit from `winston.Transport`.
//
util.inherits(Zmq, winston.Transport);

//
// Define a getter so that `winston.transports.Zmq`
// is available and thus backwards compatible.
//
winston.transports.Zmq = Zmq;

//
// ### function log (level, msg, [meta], callback)
// #### @level {string} Level at which to log the message.
// #### @msg {string} Message to log
// #### @meta {Object} **Optional** Additional metadata to attach
// #### @callback {function} Continuation to respond to when complete.
// Core logging method exposed to Winston. Metadata is optional.
//
Zmq.prototype.log = function (level, msg, meta, callback) {
    var self = this;
    var message;

    if (this.silent) {
        return callback(null, true);
    }

    try {
        message = self.constructMessage(level, msg, meta);
    } catch(err) {
        callback(err, false);
        return;
    }


    if (self.state !== 'bound') {
        // Put off sending until we're bound correctly.
        self.pending.push(message);
        return callback(null, true);
    }


    if (!self.socket || self.socket._zmq.state > 0) {
        return callback(null, true);
    }


    // Send to zmq.
    self.socket.send(message);
    self.emit('logged');

    callback(null, true);
};

//
// ### function close ()
//
Zmq.prototype.close = function () {
    if (this.socket)
    {
        this.socket.close();
        this.state = 'closed';
    }
};

Zmq.prototype.constructMessage = function(level, msg, meta, logger) {
    var self = this;
    var entry;

    // Get our message together
    if (typeof self.formatter === 'function') {
        entry = self.formatter(level, msg, meta);
    } else {
        entry = {
            timestamp: new Date(), // RFC3339/ISO8601 format instead of common.timestamp()
            level: level,
            message: msg,
            meta: meta,
            logger: logger
        };
        entry = JSON.stringify(entry);
    }

    return entry;


};
