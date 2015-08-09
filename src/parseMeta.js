"use strict";

var fs = require('fs');
var path = require('path');

var yaml = require('js-yaml');


function parseMeta(root, data) {
    var defaultMeta = fs.readFileSync(path.join(root, 'meta.yml'), 'utf8');

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
}

exports = module.exports = parseMeta;
