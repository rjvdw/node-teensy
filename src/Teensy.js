"use strict";
require('./handlebarsSetup');


const http = require('http');
const path = require('path');

const formatServerAddress = require('@rdcl/format-server-address');
const koa = require('koa');
const serve = require('koa-static');

let View; // loaded on initialize


let _app;
let _env;
let _initialized = false;


function* Teensy(next) {
    let view = yield View.get(this.request.path);

    if (view) {
        yield* view.render(this);
        return;
    }

    yield* next;
}

Teensy.initialize = function initialize(rootDir, environment, app) {
    Teensy.initialize = function() {
        console.warn('Teensy has already been initialized!');
        return Teensy;
    };

    View = require('./View');

    if (environment == null) {
        environment = 'development';
    }
    _env = environment;

    Teensy.dirs = {
        root: rootDir,
        public: path.join(rootDir, 'public'),
        views: path.join(rootDir, 'views'),
    };

    if (app == null) {
        app = koa();
    }

    _app = app;
    _app.use(Teensy);
    _app.use(serve(Teensy.dirs.public));

    _initialized = true;

    return Teensy;
};

Teensy.listen = function listen(port, host) {
    let server;

    let args = Array.prototype.slice.call(arguments);
    args.push(function () {
        let addr = server.address();

        console.log(
            'Application running on %s',
            formatServerAddress(addr)
        );
    });

    server = _app.listen.apply(_app, args);
};

exports = module.exports = Teensy;
