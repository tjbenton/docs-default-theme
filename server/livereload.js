import path from 'path'

export default function livereload(app) {
  const file_type_map = {
    jade: 'html', // `index.jade` maps to `index.html`
    styl: 'css', // `styles/site.styl` maps to `styles/site.css`
    scss: 'css', // `styles/site.scss` maps to `styles/site.css`
    sass: 'css', // `styles/site.scss` maps to `styles/site.css`
    less: 'css' // `styles/site.scss` maps to `styles/site.css`
  }

  const file_type_regex = new RegExp('\\.(' + Object.keys(file_type_map).join('|') + ')$')
  const root = path.join(__dirname, '..')
  app.use(require('easy-livereload')({
    watchDirs: [
      path.join(root, 'app'),
      path.join(root, 'public')
    ],
    checkFunc(file) {
      return file_type_regex.test(file)
    },
    renameFunc(file) {
      // remap extention of the file path to one of the extentions in `file_type_map`
      return file.replace(file_type_regex, (extention) => '.' + file_type_map[extention.slice(1)])
    },
    reloadTimeout: 2000,
    port: process.env.LIVERELOAD_PORT || 35727 || 35729,
    app: app // eslint-disable-line
  }))
}
