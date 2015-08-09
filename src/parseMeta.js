"use strict";

const fs = require('fs');
const path = require('path');

const yaml = require('js-yaml');


function parseMeta(root, data) {
    const defaultMeta = fs.readFileSync(path.join(root, 'meta.yml'), 'utf8');

    let parsed = {
        meta: {},
        template: data,
    };

    if (data.startsWith('{{!')) {
        let i = data.indexOf('}}');
        let meta = defaultMeta;
        meta += data.substring('{{!'.length, i);
        parsed.meta = yaml.safeLoad(meta).meta;
    }

    return parsed;
}

exports = module.exports = parseMeta;
