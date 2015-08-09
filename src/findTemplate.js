"use strict";

var fs = require('fs');
var path = require('path');
var util = require('util');

var glob = require('glob');
var Handlebars = require('handlebars');
var Promise = require('bluebird');

var parseMeta = require('./parseMeta');


function findTemplate(root, views, target) {
    target = path.join(views, target);
    if (target.lastIndexOf('.html') === target.length - '.html'.length) {
        target = target.substring(0, target.length - '.html'.length);
    }

    return new Promise(function executor(resolve, reject) {
        var globPattern;

        if (target === '' || target[target.length - 1] === '/') {
            globPattern = util.format(
                '%sindex.*',
                target
            );
        }
        else {
            globPattern = util.format(
                '{%s.*,%sindex.*}',
                target,
                (target[target.length - 1] === '/') ? target : (target + '/')
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

            var file = files[0];

            if (file.indexOf(views) !== 0) {
                resolve(null);
            }

            fs.readFile(file, {encoding: 'utf8'}, function (err, data) {
                if (err) {
                    reject(err);
                    return;
                }

                try {
                    var parsed = parseMeta(root, data);

                    resolve({
                        file: file,
                        isMarkdown: file.lastIndexOf('.md.hbs') === file.length - '.md.hbs'.length,
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
