# node-teensy

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]

A teensy little web framework. Teensy is a web framework that doesn't use models or controllers. Although these are undeniably useful for large web applications, for small, static websites, they sometimes introduce an unnecessary amount of overhead.

Teensy runs as [Koa](https://github.com/koajs/koa) middleware and includes [koa-static](https://github.com/koajs/static) for serving static files. Views are handled by [nunjucks](https://github.com/mozilla/nunjucks). A view may optionally have some yaml at the top (in comments), which is then made available to the template parser. This yaml may extend data from meta.yaml. This way, you can easily share data between views.

Since Teensy is Koa middleware, you need to use a version of node.js which has generator support.

## Installing
Simply run `npm install @rdcl/teensy`.

## Usage
To use Teensy, you only need a couple of things in your project directory:
* A JavaScript file to initialize Teensy.
* A directory containing a `public` dir, a `views` dir and a `meta.yml` file. This directory may be the root of your application.
That's it. For example, your project could look something like this:

```
project-root/
  public/
  views/
    index.html
  index.js
  meta.yml
```

```javascript
// index.js
'use strict'

const teensy = require('@rdcl/teensy')(__dirname)
const app = require('koa')()

app.use(teensy)
app.listen(3000)
```

```yaml
# meta.yaml
default: &default
  pageTitle: foo
```

```
{# views/index.html #}
{#!meta:
  <<: *default
  bodyClass: index
!#}

<!DOCTYPE html>
<html>
<head>
  <title>{{ $meta.pageTitle }}</title>
</head>

<body class="{{ $meta.bodyClass }}">

<h1>{{ $meta.pageTitle }}</h1>

</body>
</html>
```

Notice that index.html *starts* with a comment containing meta data. This meta data is recognized by the `{#!` and `!#}` tags.

Also notice that the meta data extends meta data in meta.yml, by using the `<<: *default` notation.

If you run `node .`, and then visit localhost:3000/ in your browser, you'll see your index view.


*TODO*: The rest of the documentation.


[npm-image]: https://img.shields.io/npm/v/@rdcl/teensy.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@rdcl/teensy
[travis-image]: https://img.shields.io/travis/rudiculous/node-teensy/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/rudiculous/node-teensy
[coveralls-image]: https://img.shields.io/coveralls/rudiculous/node-teensy/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/rudiculous/node-teensy?branch=master
