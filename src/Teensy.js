'use strict'

const path = require('path')

const compose = require('koa-compose')
const formatServerAddress = require('@rdcl/format-server-address')
const koa = require('koa')
const serve = require('koa-static')

const nunjucksSetup = require('./nunjucksSetup')
const parseMeta = require('./parseMeta')


function Teensy(root) {
  const _public = path.join(root, 'public')
  const _views = path.join(root, 'views')

  const nunjucks = nunjucksSetup(_views)

  const Teensy = compose([function* prepareTeensy(next) {
    Object.defineProperty(this.state, 'teensy', {
      enumerable: true,
      value: {},
    })

    yield* next

    // only handle HEAD and GET requests
    if (this.method !== 'HEAD' && this.method !== 'GET') return

    // response is already handled
    if (this.body != null || this.status !== 404) return

    const view = yield getView(this, root, nunjucks, '404')

    if (view) {
      this.body = view
      this.status = 404
    }
  }, serve(_public), function* Teensy(next) {
    yield* next

    // only handle HEAD and GET requests
    if (this.method !== 'HEAD' && this.method !== 'GET') return

    // response is already handled
    if (this.body != null || this.status !== 404) return

    const view = yield getView(this, root, nunjucks, this.request.path)

    if (view) {
      this.body = view
    }
  }])

  Teensy.getView = function (context, target) {
    return getView(context, root, nunjucks, target)
  }

  Teensy.parseMeta = function parseMeta(data) {
    return require('./parseMeta')(root, data)
  }

  Object.defineProperty(Teensy, 'nunjucks', {
    enumerable: true,
    get: function get() {
      return nunjucks
    },
  })

  Teensy.listen = function listen(port, host, cb) {
    const app = koa()
    app.use(Teensy)

    const server = app.listen.apply(app, arguments)

    server.on('listening', function () {
      console.log(
        'listening at %s',
        formatServerAddress(server.address())
      )
    })

    return server
  }

  return Teensy
}

function getView(context, root, nunjucks, name) {
  if (name.endsWith('/')) {
    name += 'index'
  }

  if (name.startsWith('/')) {
    name = name.substring(1)
  }

  name += '.html'

  return new Promise(function executor(resolve, reject) {
    nunjucks.getTemplate(name, function (err, tmpl) {
      if (err) {
        if (err.message.startsWith('template not found')) {
          resolve(null)
          return
        }

        reject(err)
        return
      }

      parseMeta(root, tmpl.tmplStr)
      .then(function onSuccess(parsed) {
        const templateData = context.state.teensy
        templateData.$meta = parsed.meta

        resolve(tmpl.render(templateData))
      })
      .catch(function onError(err) {
        reject(err)
      })
    })
  })
}

exports = module.exports = Teensy
