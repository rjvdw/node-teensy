"use strict";

const fs = require('fs');
const path = require('path');
const util = require('util');

const glob = require('glob');
const Handlebars = require('handlebars');

const parseMeta = require('./parseMeta');


function findTemplate(root, views, target) {
    target = path.join(views, target);
    if (target.endsWith('.html')) {
        target = target.substring(0, target.length - '.html'.length);
    }

    return new Promise(function executor(resolve, reject) {
        let globPattern;

        if (target === '' || target.endsWith('/')) {
            globPattern = util.format(
                '%sindex.*',
                target
            );
        }
        else {
            globPattern = util.format(
                '{%s.*,%sindex.*}',
                target,
                target.endsWith('/') ? target : (target + '/')
            );
        }

        glob(globPattern, function (err, files) {
            if (err) {
                reject(err);
                return;
            }

            if (!files || !files.length) {
                resolve(null);
                return;
            }

            let file = files[0];

            if (!file.startsWith(views)) {
                resolve(null);
            }

            fs.readFile(file, {encoding: 'utf8'}, function (err, data) {
                if (err) {
                    reject(err);
                    return;
                }

                try {
                    let parsed = parseMeta(root, data);

                    resolve({
                        file: file,
                        isMarkdown: Boolean(file.endsWith('.md.hbs')),
                        render: Handlebars.compile(parsed.template),
                        meta: parsed.meta,
                    });
                }
                catch (er) {
                    reject(er);
                }
            });
        });
    });
}

exports = module.exports = findTemplate;
