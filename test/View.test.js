"use strict";

const path = require('path');

const co = require('co');
const expect = require('chai').expect;
const should = require('chai').should();

const View = require('../src/View');

const sampleAppDir = path.join(__dirname, 'sampleapp');
const views = path.join(sampleAppDir, 'views');


describe('#View', function () {
    it('should return a View when called with a valid path', function (done) {
        co(function* () {
            let view = yield* View.get(sampleAppDir, views, 'index');

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
            let view = yield* View.get(sampleAppDir, views, 'invalid');

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
            let view = yield* View.get(sampleAppDir, views, 'index');
            let rendered = yield* view.render();

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
            let view = yield* View.get(sampleAppDir, views, '');
            let rendered = yield* view.render();

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
            let view = yield* View.get(sampleAppDir, views, 'markdown');
            let rendered = yield* view.render();

            expect(rendered).to.equal('<!DOCTYPE html>\n<h1 id="markdown">Markdown</h1>\n\n');
        })
            .then(function success() {
                done();
            }, function error(err) {
                done(err);
            });
    });
});
