"use strict";
require('./handlebarsSetup');


const http = require('http');
const path = require('path');

const compose = require('koa-compose');
const formatServerAddress = require('@rdcl/format-server-address');
const koa = require('koa');
const serve = require('koa-static');

const View = require('./View');


function Teensy(root) {
    let _public = path.join(root, 'public');
    let _views = path.join(root, 'views');

    let Teensy = compose([function* (next) {
        let view = yield View.get(root, _views, this.request.path);

        if (view) {
            yield* view.render(this);
            return;
        }

        yield* next;
    }, serve(_public)]);

    Teensy.listen = function listen(port, host, cb) {
        let app = koa();
        app.use(Teensy);

        let server = app.listen.apply(app, arguments);

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
