"use strict";

const fs = require('fs');
const path = require('path');

const co = require('co');
const glob = require('glob');

const parseMeta = require('./parseMeta');
const Teensy = require('./Teensy');


function getViewListing() {
    let base = Teensy.dirs.views;
    if (!base.endsWith('/')) base += '/';

    return new Promise(function executor(resolve, reject) {
        let globPattern = path.join(base, '**');
        glob(globPattern, {
            nodir: true,
        }, function (err, files) {
            if (err) {
                reject(err);
                return;
            }

            let listing = {
                files: [],
                dirs: {},
            };

            co(function* () {
                let promiseLists = [
                    listing.files,
                ];

                filesLoop:
                for (let file of files) {
                    if (file.indexOf(base) !== 0) {
                        continue;
                    }

                    let relative = file.replace(base, '');
                    let parts = relative.split(path.sep);

                    let part;
                    let dir = listing;

                    partsLoop:
                    while ( (part = parts.shift()) != null) {
                        if (part === 'layouts') {
                            continue filesLoop;
                        }

                        if (parts.length === 0) {
                            dir.files.push(getFile(file, relative));
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
                for (let list of promiseLists) {
                    for (let i = list.length - 1; i >= 0; i -= 1) {
                        list[i] = yield list[i];
                    }
                }

                resolve(listing);
            });
        });
    });
}

function getFile(absolute, relative) {
    return new Promise(function executor(resolve, reject) {
        let uri = '/' + relative.replace(/(\.md)?\.hbs$/, '');

        fs.readFile(absolute, {
            encoding: 'utf8',
        }, function (err, data) {
            if (err) {
                reject(err);
                return;
            }

            let meta = parseMeta(data).meta;

            resolve({
                path: uri,
                title: meta.title,
            });
        });
    });
}

exports = module.exports = getViewListing;
