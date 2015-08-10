"use strict";

var util = require('util');

var Handlebars = require('handlebars');
var marked = require('marked');


Handlebars.registerHelper('yield', function (value) {
    return new Handlebars.SafeString(value);
});

Handlebars.registerHelper('meta', function () {
    var res = '';

    for (var name of Object.keys(this.$meta.metaTags)) {
        var content = this.$meta.metaTags[name];

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

Handlebars.registerHelper('paginator', function (paginator, nrAround, options) {
    if (options == null) {
        options = nrAround;
        nrAround = 5;
    }

    var res = '';
    var start = paginator.current - nrAround;
    var end = paginator.current + nrAround;

    if (start < 1) {
        end += 1 - start;
        start = 1;
    }

    if (end > paginator.lastPage) {
        start -= end - paginator.lastPage;
        end = paginator.lastPage;
    }

    if (start < 1) {
        start = 1;
    }

    if (start > 1) {
        res += options.fn({
            dotdot: true,
        });
    }

    for (var i = start; i <= end; i++) {
        if (i === paginator.current) {
            res += options.fn({
                current: true,
                pageNo: i,
            });
        }
        else {
            res += options.fn({
                pageNo: i,
            });
        }
    }

    if (end < paginator.lastPage) {
        res += options.fn({
            dotdot: true,
        });
    }

    return new Handlebars.SafeString(res);
});
