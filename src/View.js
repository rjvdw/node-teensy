"use strict";

var marked = require('marked');

var findTemplate = require('./findTemplate');
var getResponseBody = require('./getResponseBody');


function View(root, views, template) {
    this._root = root;
    this._views = views;
    this.template = template;
}

View.prototype.render = function* render(context) {
    var templateData = context.state.teensy;
    templateData.$meta = this.template.meta;
    var text = this.template.render(templateData);

    if (this.template.isMarkdown) {
        text = marked(text);
    }

    return yield getResponseBody(this._views, text, templateData);
};

View.get = function* get(root, views, target) {
    var template = yield findTemplate(root, views, target);

    if (template == null) {
        return null;
    }

    return new View(root, views, template);
}

exports = module.exports = View;
