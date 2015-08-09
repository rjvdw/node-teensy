"use strict";

var fs = require('fs');
var path = require('path');

var co = require('co');
var glob = require('glob');
var Promise = require('bluebird');

var parseMeta = require('./parseMeta');


function getViewListing(root, views) {
    var base = views;
    if (base[base.length - 1] !== '/') base += '/';

    return new Promise(function executor(resolve, reject) {
        var globPattern = path.join(base, '**');
        glob(globPattern, {
            nodir: true,
        }, function (err, files) {
            if (err) {
                reject(err);
                return;
            }

            var listing = {
                files: [],
                dirs: {},
            };

            co(function* () {
                var promiseLists = [
                    listing.files,
                ];

                filesLoop:
                for (var file of files) {
                    if (file.indexOf(base) !== 0) {
                        continue;
                    }

                    var relative = file.replace(base, '');
                    var parts = relative.split(path.sep);

                    var part;
                    var dir = listing;

                    partsLoop:
                    while ( (part = parts.shift()) != null) {
                        if (part === 'layouts') {
                            continue filesLoop;
                        }

                        if (parts.length === 0) {
                            dir.files.push(getFile(root, file, relative));
                            break partsLoop;
                        }

                        if (dir.dirs[part] == null) {
                            dir.dirs[part] = {
                                files: [],
                                dirs: {},
                            };

                            promiseLists.push(dir.dirs[part].files);
                        }

                        dir = dir.dirs[part];
                    }
                }

                // Resolve all promises.
                for (var list of promiseLists) {
                    for (var i = list.length - 1; i >= 0; i -= 1) {
                        list[i] = yield list[i];
                    }
                }

                resolve(listing);
            });
        });
    });
}

function getFile(root, absolute, relative) {
    return new Promise(function executor(resolve, reject) {
        var uri = '/' + relative.replace(/(\.md)?\.hbs$/, '');

        fs.readFile(absolute, {
            encoding: 'utf8',
        }, function (err, data) {
            if (err) {
                reject(err);
                return;
            }

            var meta = parseMeta(root, data).meta;

            resolve({
                path: uri,
                title: meta.title,
            });
        });
    });
}

exports = module.exports = getViewListing;
