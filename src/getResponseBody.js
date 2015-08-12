"use strict";
var Promise = require('bluebird');

var fs = Promise.promisifyAll(require("fs"));
var path = require('path');

var co = require('co');

var compileTemplate = require('./compileTemplate');


function getResponseBody(views, view, templateData) {
    var layouts = path.join(views, 'layouts');

    return co(function* () {
        var layout = path.join(layouts, templateData.$meta.layout);

        var compiled = yield compileTemplate(layout);

        templateData['$view'] = view;
        return compiled.render(templateData);
    });
}

exports = module.exports = getResponseBody;
