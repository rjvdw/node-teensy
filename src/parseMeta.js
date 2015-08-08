"use strict";

const fs = require('fs');
const path = require('path');

const yaml = require('js-yaml');

const Teensy = require('./Teensy');


function parseMeta(data) {
    const defaultMeta = fs.readFileSync(path.join(Teensy.dirs.root, 'meta.yml'), 'utf8');

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
