/*
  eslint
  no-var: 0,
  no-magic-numbers: 0,
  prefer-arrow-callback: 0,
  prefer-template: 0,
  object-shorthand: 0,
  no-underscore-dangle: 0
*/
console.log('');
console.log('');
console.log('');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var responseTime = require('response-time');

// The main app
var app = express();

var dir = {
  app: path.join(__dirname, 'app'),
  public: path.join(__dirname, 'public')
};

// sets the port
app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', [ path.join(dir.app, 'views'), path.join(__dirname, 'app2', 'views') ].reverse());
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(responseTime());


// base locals
app.locals = {
  site_title: 'Docs',
  seo: {
    facebook: { app_id: '123', admins: '', site_name: '' },
    google_verification: '',
    google_analytics: 'UA-',
    bing: '',
    alexa: '',
    pinterest: ''
  },
  paths: {
    css: '/styles',
    images: '/images',
    js: '/js',
    fonts: '/fonts',
  },
  prefetch: [],
  css: [ 'index.css' ],
  js_top: [
    'jspm_packages/system.js',
    'config.js'
  ],
  js_bottom: []
};

var documentation = require('./docs.json');
app.locals.nav = documentation.nav;
app.locals.pages = documentation.pages;


// adds the ability to use es6 inline
var jade = require('jade');
var babel = require('jade-babel');
babel({}, jade);



// adds stylus support
var stylus = require('stylus');
var postcss = require('poststylus');
// var autoprefixer = require('autoprefixer')
// var mqpacker = require('css-mqpacker')
app.use(stylus.middleware({
  src: dir.app,
  dest: dir.public,
  force: true,
  sourcemap: true,
  debug: true,
  compile: function compileStylus(str, styl_path) {
    return stylus(str)
      .use(postcss([
        'autoprefixer',
        'css-mqpacker'
      ]))
      .set('filename', styl_path); // @import
      // .set('compress', true) // compress
  }
}));

app.use(express.static(dir.public));

// Routes
app.get('/search', function searchRoute(req, res) {
  res.render('search/index', {});
});


var valid_url = /\/[a-z~!@#$%^&*()_+`0-9-=\[\]\\{}|:";'<>,/]*(?:\?|#=.*)?$/i;
app.get(valid_url, function mainRoute(req, res) {
  function getData(route) {
    var view = documentation.pages;
    var route_nodes = route.slice(1).split('/');

    for (var i = 0; i < route_nodes.length; i++) {
      if (view.toString().slice(8, -1) !== 'Object') {
        break;
      }

      view = view[route_nodes[i]];
    }

    return view.page;
  }

  res.render('index', getData(req.path));
});

// load static files



// app.get('*.svg', function svg(req, res) {
//   res.setHeader('Content-Type', 'image/svg+xml');
// });

// Live reload the pages
if (app.get('env') === 'development') {
  var file_type_map = {
    jade: 'html', // `index.jade` maps to `index.html`
    styl: 'css', // `styles/site.styl` maps to `styles/site.css`
    scss: 'css', // `styles/site.scss` maps to `styles/site.css`
    sass: 'css', // `styles/site.scss` maps to `styles/site.css`
    less: 'css' // `styles/site.scss` maps to `styles/site.css`
  };

  var file_type_regex = new RegExp('\\.(' + Object.keys(file_type_map).join('|') + ')$');

  app.use(require('easy-livereload')({
    watchDirs: [
      __dirname,
      path.join(__dirname, 'public'),
      path.join(__dirname, 'app')
    ],
    checkFunc: function checkFunc(file) {
      return file_type_regex.test(file);
    },
    renameFunc: function renameFunc(file) {
      // remap extention of the file path to one of the extentions in `file_type_map`
      return file.replace(file_type_regex, function replaceExtention(extention) {
        return '.' + file_type_map[extention.slice(1)];
      });
    },
    reloadTimeout: 2000,
    port: process.env.LIVERELOAD_PORT || 35727 || 35729,
    app: app
  }));
}

// pretty print html
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

app.set('json spaces', 2);


var routerTable = require('./router-table.js');

// start the server
app.listen(app.get('port'), function listen() {
  console.log('Example app listening at http://%s:%s', 'localhost', app.get('port'));
  routerTable(app._router.stack);
});

module.exports = app;
