"use strict";

const marked = require('marked');

const findTemplate = require('./findTemplate');
const getViewListing = require('./getViewListing');
const getResponseBody = require('./getResponseBody');


class View {

    static *get(root, views, target) {
        // TODO: Caching?
        let template = yield findTemplate(root, views, target);

        if (template == null) {
            return null;
        }
        else {
            return new View(root, views, template);
        }
    }

    constructor(root, views, template) {
        this._root = root;
        this._views = views;
        this.template = template;
    }

    *render(context) {
        let meta = this.template.meta;
        meta.views = yield getViewListing(this._root, this._views);

        let text = this.template.render(meta);

        if (this.template.isMarkdown) {
            text = marked(text);
        }

        context.body = yield getResponseBody(this._views, text, meta);
    }

}

exports = module.exports = View;
