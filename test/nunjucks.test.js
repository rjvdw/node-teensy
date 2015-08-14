"use strict";

var path = require('path');

var expect = require('chai').expect;
var moment = require('moment');
var should = require('chai').should();

var nunjucksSetup = require('../src/nunjucksSetup');

var nunjucks = nunjucksSetup(path.join(__dirname, 'sampleapp', 'views'));


describe('#nunjucks', function () {
    it('should handle the date filter correctly', function () {
        var res;

        var dateStr = '2015-01-01 12:00:00';

        res = nunjucks.renderString('{{ published | date }}', {
            published: dateStr,
        });
        expect(res).to.equal(moment(dateStr).format());

        res = nunjucks.renderString('{{ published | date("YYYYMMDD") }}', {
            published: dateStr,
        });
        expect(res).to.equal(moment(dateStr).format('YYYYMMDD'));

        var date = new Date('2015-01-01 12:00:00');

        res = nunjucks.renderString('{{ published | date }}', {
            published: date,
        });
        expect(res).to.equal(moment(date).format());

        res = nunjucks.renderString('{{ published | date("YYYYMMDD") }}', {
            published: date,
        });
        expect(res).to.equal(moment(date).format('YYYYMMDD'));
    });

    it('should handle the {% markdown %} tag correctly', function () {
        var res = nunjucks.render('markdown_test.html');

        expect(res).to.equal('\n\n<h1 id="this-is-a-page-with-markdown">This is a page with markdown</h1>\n<p>It has some text.</p>\n<ul>\n<li>even a bullet list</li>\n<li>with multiple bullets</li>\n<li>imagine that</li>\n</ul>\n\n');
    });

    it('should handle the {% meta %} tag correctly', function () {
        var res = nunjucks.renderString('{% meta $meta.metaTags %}', {
            $meta: {
                metaTags: {
                    description: 'This is a description',
                    author: 'Author <auth@test.com>',
                    keywords: ['foo', 'bar', 'baz'],
                },
            },
        });

        expect(res).to.equal('<meta name="author" content="Author &lt;auth@test.com&gt;">\n<meta name="description" content="This is a description">\n<meta name="keywords" content="foo,bar,baz">\n');
    });

    it('should handle the {% pagination %} tag correctly', function () {
        var res;

        res = nunjucks.render('pagination_test.html', {
            pgn: {
                current: 1,
                lastPage: 10,
            },
        });
        expect(res).to.equal('<ul>\n\n  <li class="active">1</li>\n\n  <li><a href="?pageNo=2">2</a></li>\n\n  <li><a href="?pageNo=3">3</a></li>\n\n  <li><a href="?pageNo=4">4</a></li>\n\n  <li><a href="?pageNo=5">5</a></li>\n\n  <li>...</li>\n\n</ul>\n');

        res = nunjucks.render('pagination_test.html', {
            pgn: {
                current: 2,
                lastPage: 10,
            },
        });
        expect(res).to.equal('<ul>\n\n  <li><a href="?pageNo=1">1</a></li>\n\n  <li class="active">2</li>\n\n  <li><a href="?pageNo=3">3</a></li>\n\n  <li><a href="?pageNo=4">4</a></li>\n\n  <li><a href="?pageNo=5">5</a></li>\n\n  <li>...</li>\n\n</ul>\n');

        res = nunjucks.render('pagination_test.html', {
            pgn: {
                current: 5,
                lastPage: 10,
            },
        });
        expect(res).to.equal('<ul>\n\n  <li>...</li>\n\n  <li><a href="?pageNo=3">3</a></li>\n\n  <li><a href="?pageNo=4">4</a></li>\n\n  <li class="active">5</li>\n\n  <li><a href="?pageNo=6">6</a></li>\n\n  <li><a href="?pageNo=7">7</a></li>\n\n  <li>...</li>\n\n</ul>\n');

        res = nunjucks.render('pagination_test.html', {
            pgn: {
                current: 9,
                lastPage: 10,
            },
        });
        expect(res).to.equal('<ul>\n\n  <li>...</li>\n\n  <li><a href="?pageNo=6">6</a></li>\n\n  <li><a href="?pageNo=7">7</a></li>\n\n  <li><a href="?pageNo=8">8</a></li>\n\n  <li class="active">9</li>\n\n  <li><a href="?pageNo=10">10</a></li>\n\n</ul>\n');

        res = nunjucks.render('pagination_test.html', {
            pgn: {
                current: 10,
                lastPage: 10,
            },
        });
        expect(res).to.equal('<ul>\n\n  <li>...</li>\n\n  <li><a href="?pageNo=6">6</a></li>\n\n  <li><a href="?pageNo=7">7</a></li>\n\n  <li><a href="?pageNo=8">8</a></li>\n\n  <li><a href="?pageNo=9">9</a></li>\n\n  <li class="active">10</li>\n\n</ul>\n');

        res = nunjucks.render('pagination_test2.html', {
            pgn: {
                current: 5,
                lastPage: 10,
            },
        });
        expect(res).to.equal('<ul>\n\n  <li><a href="?pageNo=3">3</a></li>\n\n  <li><a href="?pageNo=4">4</a></li>\n\n  <li class="active">5</li>\n\n  <li><a href="?pageNo=6">6</a></li>\n\n  <li><a href="?pageNo=7">7</a></li>\n\n</ul>\n');
    });
});
