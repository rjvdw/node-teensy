"use strict";

const fs = require('fs');
const path = require('path');

const yaml = require('js-yaml');

const Teensy = require('./Teensy');


function parseMeta(data) {
    const defaultMeta = fs.readFileSync(path.join(Teensy.dirs.root, 'meta.yml'), 'utf8');

    let parsed;

    if (data.startsWith('{{!')) {
        let lines = data.substring('{{!'.length).split(/\r\n|\n|\r/);
        let meta = defaultMeta;

        let line;
        while ( (line = lines.shift()) != null ) {
            if (line === '}}') {
                break;
            }

            meta += line + '\n';
        }

        meta = yaml.safeLoad(meta).meta;

        parsed = {
            meta: meta,
            template: lines.join('\n'),
        };
    }
    else {
        parsed = {
            meta: {},
            template: data,
        };
    }

    return parsed;
}

exports = module.exports = parseMeta;
