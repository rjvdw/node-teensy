'use strict'
var Promise = require('bluebird')

var fs = Promise.promisifyAll(require('fs'))
var path = require('path')

var co = require('co')
var yaml = require('js-yaml')


function parseMeta(root, data) {
  return co(function *() {
    var defaultMetaFile = path.join(root, 'meta.yml')
    var defaultMeta = yield fs.readFileAsync(defaultMetaFile, {
      encoding: 'utf8',
    })

    var parsed = {
      meta: {},
      template: data,
    }

    var start = data.indexOf('{#!')
    if (start > -1) {
      var end = data.indexOf('!#}', start)
      var meta = defaultMeta
      meta += data.substring(start + '{#!'.length, end)
      parsed.meta = yaml.safeLoad(meta).meta
    }

    return parsed
  })
}

exports = module.exports = parseMeta
