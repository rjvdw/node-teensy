"use strict";

var fs = require('fs');

var Handlebars = require('handlebars');
var Promise = require('bluebird');

var cache = {};

function compileTemplate(file, cb) {
    var promise = new Promise(function executor(resolve, reject) {
        fs.stat(file, function (err, stat) {
            if (err) {
                reject(err);
                return;
            }

            if (cache[file] != null) {
                if (cache[file].lastModified >= stat.mtime) {
                    console.log('serving from cache');
                    resolve(cache[file]);
                    return;
                }
            }

            fs.readFile(file, {
                encoding: 'utf8',
            }, function (err, data) {
                if (err) {
                    reject(err);
                    return;
                }

                cache[file] = {
                    render: Handlebars.compile(data),
                    lastModified: stat.mtime,
                    data: data,
                };

                console.log('not serving from cache');
                resolve(cache[file]);
            });
        });
    });

    if (cb != null) {
        promise
            .then(function (compiled) {
                cb(null, compiled);
            })
            .catch(function (err) {
                cb(err);
            });
    }

    return promise;
}

exports = module.exports = compileTemplate;
