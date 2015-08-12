"use strict";

var fs = require('fs');
var path = require('path');

var Promise = require('bluebird');
var yaml = require('js-yaml');


function parseMeta(root, data, cb) {
    var promise = new Promise(function executor(resolve, reject) {
        var defaultMetaFile = path.join(root, 'meta.yml');

        fs.readFile(defaultMetaFile, {
            encoding: 'utf8',
        }, function (err, defaultMeta) {
            if (err) {
                reject(err);
                return;
            }

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

            resolve(parsed);
        });
    });

    if (cb != null) {
        promise
            .then(function (parsed) {
                cb(null, parsed);
            })
            .catch(function (err) {
                cb(err);
            });
    }

    return promise;
}

exports = module.exports = parseMeta;
