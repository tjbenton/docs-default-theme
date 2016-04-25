/*
  eslint
  no-var: 0,
  no-magic-numbers: 0,
  prefer-arrow-callback: 0,
  prefer-template: 0,
  object-shorthand: 0,
  no-underscore-dangle: 0
*/
console.log('')
console.log('')
console.log('')
import express from 'express'
import path from 'path'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import responseTime from 'response-time'
const pkg = require(path.join(process.cwd(), 'package.json')) // the package for the project this is being used on

// The main app
const app = express()

import config from '../config.json'
// base locals
app.locals = config
app.locals.path = path

const dir = {
  app: path.join(process.cwd(), 'app'),
  public: path.join(process.cwd(), 'public')
}
app.dir = dir

// sets the port
app.set('port', process.env.PORT || 3000)
app.locals.pretty = true
app.set('json spaces', 2)

// view engine setup
app.set('views', [
  // path.join(process.cwd(), 'app', 'views'),
  path.join(dir.app, 'views'),
].reverse())
app.set('view engine', 'jade')


app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(responseTime())

const documentation = require('../docs.json')
app.locals.nav = documentation.nav
app.locals.pages = documentation.pages
app.locals.prefix = 'docs'
app.locals.pkg = pkg

const getType = (obj) => obj.toString().slice(9, -1).toLowerCase()
app.locals.getType = getType

const random = (min, max) => min === max ? min : Math.floor(Math.random() * (max - min + 1)) + min
app.locals.random = random

import highlight from './highlight.js'
app.locals.highlight_types = highlight.highlight_types
app.locals.highlight = highlight.highlight
app.locals.syntax_highlight = highlight.syntax_highlight

// adds the ability to use es6 inline
import jade from 'jade'
import babel from 'jade-babel'
babel({}, jade)

// adds stylus support
import styles from './styles.js'
styles(app)

app.use(express.static(dir.public))

// This cas be used in the jade files to generate a unique id for a section
import base from './base-x'
app.locals.encode = base.encodeString



import routes from './routes'
routes(app)

// app.get('*.svg', function svg(req, res) {
//   res.setHeader('Content-Type', 'image/svg+xml');
// });

import livereload from './livereload'
// Live reload the pages
if (app.get('env') === 'development') {
  livereload(app)
}

import routerTable from './router-table.js'
// start the server
app.listen(app.get('port'), () => {
  console.log(`Example app listening at http://localhost:${app.get('port')}`)
  routerTable(app._router.stack)
})

import clone from 'clone'
let globals = clone(app.locals)
const globals_to_delete = [ 'nav', 'pages', 'path', 'LRScript', 'highlight_types' ]
for (let key in globals) {
  if (globals.hasOwnProperty(key)) {
    if (
      typeof globals[key] === 'function' ||
      globals_to_delete.indexOf(key) > -1
    ) {
      delete globals[key]
    }
  }
}

app.locals.jade_globals = JSON.stringify(globals, null, 2)

app.locals.locals = app.locals
module.exports = app
