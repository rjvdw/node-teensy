'use strict'

const http = require('http')
const path = require('path')

const expect = require('chai').expect
const koa = require('koa')
const should = require('chai').should()

const Teensy = require('../src/Teensy')

const sampleAppDir = path.join(__dirname, 'sampleapp')
const sampleAppWithout404Dir = path.join(__dirname, 'sampleapp_without404')


describe('#Teensy', function () {
  it('should create a new Teensy middleware', function (done) {
    const teensy = Teensy(sampleAppDir)

    expect(teensy).to.be.a('function')
    expect(teensy.constructor.name).to.equal('GeneratorFunction')
    expect(teensy).to.have.property('listen')
    expect(teensy).to.have.property('parseMeta')
    expect(teensy).to.have.property('nunjucks')
    expect(teensy).to.have.property('getView')
    expect(teensy.listen).to.be.a('function')

    teensy.parseMeta('{#!meta:\n  <<: *default\n!#}')
    .then(function (parsed) {
      expect(parsed.meta).to.deep.equal({layout:'main.hbs',metaTags:{robots:'index,follow'}})
    })
    .then(function () {
      return teensy.getView({
        state: {
          teensy: {},
        },
      }, '/')
    })
    .then(function (view) {
      expect(view).to.equal('<!DOCTYPE html>\n\n<h1>Test</h1>\n\n')
    })
    .then(function () {
      done()
    })
    .catch(function (err) {
      done(err)
    })
  })

  it('should start a HTTP server with the .listen method', function (done) {
    const server = Teensy(sampleAppDir).listen(function () {
      done()
      server.close()
    })
  })

  it('should return valid responses', function (done) {
    const server = Teensy(sampleAppDir).listen(function () {
      const addr = server.address()

      http.get({
        host: addr.address,
        port: addr.port,
        method: 'GET',
        path: '/',
      }, function (res) {
        should.exist(res)
        expect(res).to.have.property('statusCode', 200)

        res.setEncoding('utf8')
        let body = ''
        res.on('data', function (chunk) {
          body += chunk
        })

        res.on('end', function() {
          expect(body).to.equal('<!DOCTYPE html>\n\n<h1>Test</h1>\n\n')
          server.close()
          done()
        })
      })
    })
  })

  it('should serve static files from public', function (done) {
    const server = Teensy(sampleAppDir).listen(function () {
      const addr = server.address()

      http.get({
        host: addr.address,
        port: addr.port,
        method: 'GET',
        path: '/file.txt',
      }, function (res) {
        should.exist(res)
        expect(res).to.have.property('statusCode', 200)

        res.setEncoding('utf8')
        let body = ''
        res.on('data', function (chunk) {
          body += chunk
        })  

        res.on('end', function() {
          expect(body).to.equal('test\n')
          server.close()
          done()
        })  
      })  
    })  
  })  

  it('should return a 404 response if the requested url does not exist', function (done) {
    const server = Teensy(sampleAppDir).listen(function () {
      const addr = server.address()

      http.get({
        host: addr.address,
        port: addr.port,
        method: 'GET',
        path: '/does-not-exist',
      }, function (res) {
        should.exist(res)
        expect(res).to.have.property('statusCode', 404)

        res.setEncoding('utf8')
        let body = ''
        res.on('data', function (chunk) {
          body += chunk
        })

        res.on('end', function() {
          expect(body).to.equal('<h1>404</h1>\n')
          server.close()
          done()
        })
      })
    })
  })

  it('should return a generic 404 if the 404 template also does not exist', function (done) {
    const server = Teensy(sampleAppWithout404Dir).listen(function () {
      const addr = server.address()

      http.get({
        host: addr.address,
        port: addr.port,
        method: 'GET',
        path: '/does-not-exist',
      }, function (res) {
        should.exist(res)
        expect(res).to.have.property('statusCode', 404)

        res.setEncoding('utf8')
        let body = ''
        res.on('data', function (chunk) {
          body += chunk
        })

        res.on('end', function() {
          expect(body).to.equal('Not Found')
          server.close()
          done()
        })
      })
    })
  })

  it('should do nothing if other middleware already gave a response', function (done) {
    const app = koa()

    app.use(Teensy(sampleAppDir))
    app.use(function* (next) {
      this.body = 'foo'
      yield* next
    })

    const server = app.listen(function () {
      const addr = server.address()

      http.get({
        host: addr.address,
        port: addr.port,
        method: 'GET',
        path: '/',
      }, function (res) {
        should.exist(res)
        expect(res).to.have.property('statusCode', 200)

        res.setEncoding('utf8')
        let body = ''
        res.on('data', function (chunk) {
          body += chunk
        })

        res.on('end', function() {
          expect(body).to.equal('foo')
          server.close()
          done()
        })
      })
    })
  })

  it('requests other than GET an HEAD should be ignored', function (done) {
    const server = Teensy(sampleAppDir).listen(function () {
      const addr = server.address()

      http.get({
        host: addr.address,
        port: addr.port,
        method: 'POST',
        path: '/',
      }, function (res) {
        should.exist(res)
        expect(res).to.have.property('statusCode', 404)

        res.setEncoding('utf8')
        let body = ''
        res.on('data', function (chunk) {
          body += chunk
        })

        res.on('end', function() {
          expect(body).to.equal('Not Found')
          server.close()
          done()
        })
      })
    })
  })
})
