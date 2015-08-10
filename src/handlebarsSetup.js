"use strict";

var util = require('util');

var Handlebars = require('handlebars');
var marked = require('marked');


Handlebars.registerHelper('yield', function (value) {
    return new Handlebars.SafeString(value);
});

Handlebars.registerHelper('meta', function () {
    var res = '';

    for (var name of Object.keys(this.metaTags)) {
        var content = this.metaTags[name];

        res += util.format(
            '<meta name="%s" content="%s">\n',
            Handlebars.Utils.escapeExpression(name),
            Handlebars.Utils.escapeExpression(content)
        );
    }

    return new Handlebars.SafeString(res);
});

Handlebars.registerHelper('markdown', function (options) {
    var md = options.fn(0);

    return new Handlebars.SafeString(marked(md));
});
