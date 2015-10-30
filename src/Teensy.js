'use strict'
const Bluebird = require('bluebird')

const path = require('path')

const compose = require('koa-compose')
const formatServerAddress = require('@rdcl/format-server-address')
const Koa = require('koa')
const serve = require('koa-static')

const nunjucksSetup = require('./nunjucksSetup')
const parseMeta = require('./parseMeta')


function Teensy(root) {
  const _public = path.join(root, 'public')
  const _views = path.join(root, 'views')

  const nunjucks = nunjucksSetup(_views)

  const Teensy = compose([
    Bluebird.coroutine(function* prepareTeensy(ctx, next) {
      Object.defineProperty(ctx.state, 'teensy', {
        enumerable: true,
        value: {},
      })

      yield next()

      // only handle HEAD and GET requests
      if (ctx.method !== 'HEAD' && ctx.method !== 'GET') return

      // response is already handled
      if (ctx.body != null || ctx.status !== 404) return

      const view = yield getView(ctx, root, nunjucks, '404')

      if (view) {
        ctx.body = view
        ctx.status = 404
      }
    }),
    //serve(_public, {
    //  format: false,
    //  hidden: true,
    //}),
    Bluebird.coroutine(function* Teensy(ctx, next) {
      yield next()

      // only handle HEAD and GET requests
      if (ctx.method !== 'HEAD' && ctx.method !== 'GET') return

      // response is already handled
      if (ctx.body != null || ctx.status !== 404) return

      const view = yield getView(ctx, root, nunjucks, ctx.request.path)

      if (view) {
        ctx.body = view
      }
    }),
  ])

  Teensy.getView = (context, target) => getView(context, root, nunjucks, target)
  Teensy.parseMeta = (data) => require('./parseMeta')(root, data)

  Object.defineProperty(Teensy, 'nunjucks', {
    enumerable: true,
    get() {
      return nunjucks
    },
  })

  Teensy.listen = function listen(port, host, cb) {
    const app = new Koa()
    app.use(Teensy)

    const server = app.listen.apply(app, arguments)

    server.on('listening', () => {
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
