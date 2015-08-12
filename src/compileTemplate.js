"use strict";
var Promise = require('bluebird');

var fs = Promise.promisifyAll(require("fs"));

var co = require('co');
var Handlebars = require('handlebars');

var cache = {};

function compileTemplate(file) {
    return co(function* () {
        var stat = yield fs.statAsync(file);

        if (cache[file] != null) {
            if (cache[file].lastModified >= stat.mtime) {
                return cache[file];
            }
        }

        var data = yield fs.readFileAsync(file, {
            encoding: 'utf8',
        });

        cache[file] = {
            render: Handlebars.compile(data),
            lastModified: stat.mtime,
            data: data,
        };

        return cache[file];
    });
}

exports = module.exports = compileTemplate;
