"use strict";

const http = require('http');
const path = require('path');

const expect = require('chai').expect;
const should = require('chai').should();

const Teensy = require('../src/Teensy');

const sampleAppDir = path.join(__dirname, 'sampleapp');


describe('#Teensy', function () {
    it('should create a new Teensy middleware', function () {
        let teensy = Teensy(sampleAppDir);

        expect(teensy).to.be.a('function');
        expect(teensy.constructor.name).to.equal('GeneratorFunction');
        expect(teensy).to.have.property('listen');
        expect(teensy.listen).to.be.a('function');
    });

    it('should start a HTTP server with the .listen method', function (done) {
        let server = Teensy(sampleAppDir).listen(function () {
            done();
            server.close();
        });
    });

    it('should return valid responses', function (done) {
        let server = Teensy(sampleAppDir).listen(function () {
            let addr = server.address();

            http.get({
                host: addr.address,
                port: addr.port,
                method: 'GET',
                path: '/',
            }, function (res) {
                should.exist(res);
                expect(res).to.have.property('statusCode', 200);

                res.setEncoding('utf8');
                let body = '';
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
