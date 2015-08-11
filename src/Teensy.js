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

    var _Handlebars = require('handlebars');
    var _parseMeta = require('./parseMeta');

    var Teensy = compose([function* (next) {
        Object.defineProperty(this.state, 'teensy', {
            enumerable: true,
            value: {},
        });

        yield* next;

        // only handle HEAD and GET requests
        if (this.method !== 'HEAD' && this.method !== 'GET') return;

        // response is already handled
        if (this.body != null || this.status !== 404) return;

        var view = yield* View.get(root, _views, this.request.path);

        if (view) {
            this.body = yield* view.render(this);
            return;
        }
    }, serve(_public), function* handle404(next) {
        yield* next;

        // only handle HEAD and GET requests
        if (this.method !== 'HEAD' && this.method !== 'GET') return;

        // response is already handled
        if (this.body != null || this.status !== 404) return;

        var view = yield* View.get(root, _views, '404');

        if (view) {
            this.body = yield* view.render(this);
            return;
        }
    }]);

    Teensy.parseMeta = function parseMeta(data) {
        return _parseMeta(root, data);
    };

    Object.defineProperty(Teensy, 'Handlebars', {
        enumerable: true,
        value: _Handlebars,
    });

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
