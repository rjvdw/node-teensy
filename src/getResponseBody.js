"use strict";

var fs = require('fs');
var path = require('path');

var Handlebars = require('handlebars');
var Promise = require('bluebird');


function getResponseBody(views, main, meta) {
    var layouts = path.join(views, 'layouts');

    return new Promise(function executor(resolve, reject) {
        var layout = path.join(layouts, meta.layout);

        fs.readFile(layout, {encoding: 'utf8'}, function (err, data) {
            if (err) {
                reject(err);
                return;
            }

            try {
                var render = Handlebars.compile(data);

                meta.main = main;
                resolve(render(meta));
            }
            catch (er) {
                reject(er);
            }
        });
    });
}

exports = module.exports = getResponseBody;
