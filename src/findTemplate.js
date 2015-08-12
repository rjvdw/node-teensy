"use strict";
var Promise = require('bluebird');

var fs = Promise.promisifyAll(require("fs"));
var path = require('path');
var util = require('util');

var co = require('co');
var glob = Promise.promisify(require('glob'));

var compileTemplate = require('./compileTemplate');
var parseMeta = require('./parseMeta');


function findTemplate(root, views, target) {
    target = path.join(views, target);
    if (target.lastIndexOf('.html') === target.length - '.html'.length) {
        target = target.substring(0, target.length - '.html'.length);
    }

    return co(function* () {
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

        var files = yield glob(globPattern);

        if (!files || !files.length) {
            return null;
        }

        var file = files[0];

        if (file.indexOf(views) !== 0) {
            return null;
        }

        var compiled = yield compileTemplate(file);
        var parsed = yield parseMeta(root, compiled.data);

        return {
            file: file,
            isMarkdown: file.lastIndexOf('.md.hbs') === file.length - '.md.hbs'.length,
            render: compiled.render,
            meta: parsed.meta,
        };
    });
}

exports = module.exports = findTemplate;
