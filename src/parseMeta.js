'use strict'
const Promise = require('bluebird')

const fs = Promise.promisifyAll(require('fs'))
const path = require('path')

const co = require('co')
const yaml = require('js-yaml')


function parseMeta(root, data) {
  return co(function *() {
    const defaultMetaFile = path.join(root, 'meta.yml')
    const defaultMeta = yield fs.readFileAsync(defaultMetaFile, {
      encoding: 'utf8',
    })

    const parsed = {
      meta: {},
      template: data,
    }

    const start = data.indexOf('{#!')
    if (start > -1) {
      const end = data.indexOf('!#}', start)
      let meta = defaultMeta
      meta += data.substring(start + '{#!'.length, end)
      parsed.meta = yaml.safeLoad(meta).meta
    }

    return parsed
  })
}

exports = module.exports = parseMeta
