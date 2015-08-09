"use strict";

var path = require('path');

var co = require('co');
var expect = require('chai').expect;
var should = require('chai').should();

var View = require('../src/View');

var sampleAppDir = path.join(__dirname, 'sampleapp');
var views = path.join(sampleAppDir, 'views');


describe('#View', function () {
    it('should return a View when called with a valid path', function (done) {
        co(function* () {
            var view = yield* View.get(sampleAppDir, views, 'index');

            should.exist(view);
            expect(view).to.be.an.instanceof(View);
        })
            .then(function success() {
                done();
            }, function error(err) {
                done(err);
            });
    });

    it('should return null when called with an invalid path', function (done) {
        co(function* () {
            var view = yield* View.get(sampleAppDir, views, 'invalid');

            should.not.exist(view);
        })
            .then(function success() {
                done();
            }, function error(err) {
                done(err);
            });
    });

    it('should be able to render', function (done) {
        co(function* () {
            var view = yield* View.get(sampleAppDir, views, 'index');
            var rendered = yield* view.render();

            expect(rendered).to.equal('<!DOCTYPE html>\n\n<h1>Test</h1>\n\n');
        })
            .then(function success() {
                done();
            }, function error(err) {
                done(err);
            });
    });

    it('should render index when called with a path that resolves to a directory', function (done) {
        co(function* () {
            var view = yield* View.get(sampleAppDir, views, '');
            var rendered = yield* view.render();

            expect(rendered).to.equal('<!DOCTYPE html>\n\n<h1>Test</h1>\n\n');
        })
            .then(function success() {
                done();
            }, function error(err) {
                done(err);
            });
    });

    it('should correctly handle markdown views', function (done) {
        co(function* () {
            var view = yield* View.get(sampleAppDir, views, 'markdown');
            var rendered = yield* view.render();

            expect(rendered).to.equal('<!DOCTYPE html>\n<h1 id="markdown">Markdown</h1>\n\n');
        })
            .then(function success() {
                done();
            }, function error(err) {
                done(err);
            });
    });
});
