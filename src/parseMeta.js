"use strict";
var Promise = require('bluebird');

var fs = Promise.promisifyAll(require("fs"));
var path = require('path');

var co = require('co');
var yaml = require('js-yaml');


function parseMeta(root, data) {
    return co(function *() {
        var defaultMetaFile = path.join(root, 'meta.yml');
        var defaultMeta = yield fs.readFileAsync(defaultMetaFile, {
            encoding: 'utf8',
        });

        var parsed = {
            meta: {},
            template: data,
        };

        if (data.indexOf('{{!') === 0) {
            var i = data.indexOf('}}');
            var meta = defaultMeta;
            meta += data.substring('{{!'.length, i);
            parsed.meta = yaml.safeLoad(meta).meta;
        }

        return parsed;
    });
}

exports = module.exports = parseMeta;
