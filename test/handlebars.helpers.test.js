"use strict";
require('../src/handlebarsSetup');


var path = require('path');

var expect = require('chai').expect;
var Handlebars = require('handlebars');
var should = require('chai').should();


describe('Handlebar helpers', function () {
    it('the yield helper should leave its input alone', function () {
        var template = Handlebars.compile('{{yield "<h1>{{foo}}</h1>"}}');
        var parsed = template({foo: 'bar'});

        expect(parsed).to.equal('<h1>{{foo}}</h1>');
    });

    it('the meta helper should print meta headers', function () {
        var template = Handlebars.compile('{{meta}}');
        var parsed = template({metaTags: {
            description: 'test',
            author: 'test <test@test.com>',
        }});

        var metaTags = [
            '<meta name="description" content="test">',
            '<meta name="author" content="test &lt;test@test.com&gt;">',
        ];

        expect(parsed).to.satisfy(function (val) {
            if (val === metaTags[0] + '\n' + metaTags[1] + '\n') {
                return true;
            }

            if (val === metaTags[1] + '\n' + metaTags[0] + '\n') {
                return true;
            }

            return false;
        });
    });

    it('the markdown helper should parse markdown', function () {
        var template = Handlebars.compile('<p>test</p>\n{{#markdown}}# Title{{/markdown}}');
        var parsed = template({});

        expect(parsed).to.equal('<p>test</p>\n<h1 id="title">Title</h1>\n');
    });
});
