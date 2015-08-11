"use strict";

var fs = require('fs');
var path = require('path');

var Promise = require('bluebird');

var compileTemplate = require('./compileTemplate');


function getResponseBody(views, view, templateData) {
    var layouts = path.join(views, 'layouts');

    return new Promise(function executor(resolve, reject) {
        var layout = path.join(layouts, templateData.$meta.layout);

        compileTemplate(layout, function (err, compiled) {
            if (err) {
                reject(err);
                return;
            }

            templateData['$view'] = view;
            resolve(compiled.render(templateData))
        });
    });
}

exports = module.exports = getResponseBody;
