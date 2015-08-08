"use strict";

const marked = require('marked');

const findTemplate = require('./findTemplate');
const getViewListing = require('./getViewListing');
const getResponseBody = require('./getResponseBody');


class View {

    static *get(target) {
        // TODO: Caching?
        let template = yield findTemplate(target);

        if (template == null) {
            return null;
        }
        else {
            return new View(template);
        }
    }

    constructor(template) {
        this.template = template;
    }

    *render(context) {
        let meta = this.template.meta;
        meta.views = yield getViewListing();

        let text = this.template.render(meta);

        if (this.template.isMarkdown) {
            text = marked(text);
        }

        context.body = yield getResponseBody(text, meta);
    }

}

exports = module.exports = View;
