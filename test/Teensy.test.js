"use strict";

var http = require('http');
var path = require('path');

var expect = require('chai').expect;
var should = require('chai').should();

var Teensy = require('../src/Teensy');

var sampleAppDir = path.join(__dirname, 'sampleapp');


describe('#Teensy', function () {
    it('should create a new Teensy middleware', function () {
        var teensy = Teensy(sampleAppDir);

        expect(teensy).to.be.a('function');
        expect(teensy.constructor.name).to.equal('GeneratorFunction');
        expect(teensy).to.have.property('listen');
        expect(teensy.listen).to.be.a('function');
    });

    it('should start a HTTP server with the .listen method', function (done) {
        var server = Teensy(sampleAppDir).listen(function () {
            done();
            server.close();
        });
    });

    it('should return valid responses', function (done) {
        var server = Teensy(sampleAppDir).listen(function () {
            var addr = server.address();

            http.get({
                host: addr.address,
                port: addr.port,
                method: 'GET',
                path: '/',
            }, function (res) {
                should.exist(res);
                expect(res).to.have.property('statusCode', 200);

                res.setEncoding('utf8');
                var body = '';
                res.on('data', function (chunk) {
                    body += chunk;
                });

                res.on('end', function() {
                    expect(body).to.equal('<!DOCTYPE html>\n\n<h1>Test</h1>\n\n');
                    server.close();
                    done();
                });
            });
        });
    });
});
