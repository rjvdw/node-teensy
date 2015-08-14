"use strict";

var http = require('http');
var path = require('path');

var compose = require('koa-compose');
var formatServerAddress = require('@rdcl/format-server-address');
var koa = require('koa');
var serve = require('koa-static');

var nunjucksSetup = require('./nunjucksSetup');
var parseMeta = require('./parseMeta');


function Teensy(root) {
    var _public = path.join(root, 'public');
    var _views = path.join(root, 'views');

    var nunjucks = nunjucksSetup(_views);

    var Teensy = compose([function* prepareTeensy(next) {
        Object.defineProperty(this.state, 'teensy', {
            enumerable: true,
            value: {},
        });

        yield* next;

        // only handle HEAD and GET requests
        if (this.method !== 'HEAD' && this.method !== 'GET') return;

        // response is already handled
        if (this.body != null || this.status !== 404) return;

        var view = yield getView(this, root, nunjucks, '404');

        if (view) {
            this.body = view;
            this.status = 404;
        }
    }, serve(_public), function* Teensy(next) {
        yield* next;

        // only handle HEAD and GET requests
        if (this.method !== 'HEAD' && this.method !== 'GET') return;

        // response is already handled
        if (this.body != null || this.status !== 404) return;

        var view = yield getView(this, root, nunjucks, this.request.path);

        if (view) {
            this.body = view;
        }
    }]);

    Teensy.getView = function (context, target) {
        return getView(context, root, nunjucks, target);
    };

    Teensy.parseMeta = function parseMeta(data) {
        return require('./parseMeta')(root, data);
    };

    Object.defineProperty(Teensy, 'nunjucks', {
        enumerable: true,
        get: function get() {
            return nunjucks;
        },
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

function getView(context, root, nunjucks, name) {
    if (name[name.length - 1] === '/') {
        name += 'index';
    }

    if (name[0] === '/') {
        name = name.substring(1);
    }

    name += '.html';

    return new Promise(function executor(resolve, reject) {
        nunjucks.getTemplate(name, function (err, tmpl) {
            if (err) {
                if (err.message.indexOf('template not found') === 0) {
                    resolve(null);
                    return;
                }

                reject(err);
                return;
            }

            parseMeta(root, tmpl.tmplStr)
                .then(function onSuccess(parsed) {
                    var templateData = context.state.teensy;
                    templateData.$meta = parsed.meta;

                    resolve(tmpl.render(templateData));
                })
                .catch(function onError(err) {
                    reject(err);
                });
        });
    });
}

exports = module.exports = Teensy;
