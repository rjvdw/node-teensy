"use strict";

const fs = require('fs');
const path = require('path');

const Handlebars = require('handlebars');


function getResponseBody(views, main, meta) {
    const layouts = path.join(views, 'layouts');

    return new Promise(function executor(resolve, reject) {
        let layout = path.join(layouts, meta.layout);

        fs.readFile(layout, {encoding: 'utf8'}, function (err, data) {
            if (err) {
                reject(err);
                return;
            }

            try {
                let render = Handlebars.compile(data);

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
