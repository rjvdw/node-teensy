"use strict";

const util = require('util');

const Handlebars = require('handlebars');
const marked = require('marked');


Handlebars.registerHelper('raw', function (value) {
    return new Handlebars.SafeString(value);
});

Handlebars.registerHelper('meta', function () {
    let res = '';

    for (let name of Object.keys(this.metaTags)) {
        let content = this.metaTags[name];

        res += util.format(
            '<meta name="%s" content="%s">\n',
            Handlebars.Utils.escapeExpression(name),
            Handlebars.Utils.escapeExpression(content)
        );
    }

    return new Handlebars.SafeString(res);
});

Handlebars.registerHelper('markdown', function (options) {
    let md = options.fn(0);

    return new Handlebars.SafeString(marked(md));
});
