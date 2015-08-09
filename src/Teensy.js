"use strict";
require('./handlebarsSetup');


var http = require('http');
var path = require('path');

var compose = require('koa-compose');
var formatServerAddress = require('@rdcl/format-server-address');
var koa = require('koa');
var serve = require('koa-static');

var View = require('./View');


function Teensy(root) {
    var _public = path.join(root, 'public');
    var _views = path.join(root, 'views');

    var Teensy = compose([function* (next) {
        var view = yield* View.get(root, _views, this.request.path);

        if (view) {
            this.body = yield* view.render(this);
            return;
        }

        yield* next;
    }, serve(_public)]);

    Teensy.listen = function listen(port, host, cb) {
        var app = koa();
        app.use(Teensy);

        var server = app.listen.apply(app, arguments);

        server.on('listening', function () {
            console.log(
                'listening at %s',
                formatServerAddress(server.address())
            );
        });

        return server;
    };

    return Teensy;
}

exports = module.exports = Teensy;
