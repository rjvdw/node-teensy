"use strict";
require('../src/handlebarsSetup');


const path = require('path');

const expect = require('chai').expect;
const Handlebars = require('handlebars');
const should = require('chai').should();


describe('Handlebar helpers', function () {
    it('the raw helper should leave its input alone', function () {
        let template = Handlebars.compile('{{raw "<h1>{{foo}}</h1>"}}');
        let parsed = template({foo: 'bar'});

        expect(parsed).to.equal('<h1>{{foo}}</h1>');
    });

    it('the meta helper should print meta headers', function () {
        let template = Handlebars.compile('{{meta}}');
        let parsed = template({metaTags: {
            description: 'test',
            author: 'test <test@test.com>',
        }});

        let metaTags = [
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
        let template = Handlebars.compile('<p>test</p>\n{{#markdown}}# Title{{/markdown}}');
        let parsed = template({});

        expect(parsed).to.equal('<p>test</p>\n<h1 id="title">Title</h1>\n');
    });
});
