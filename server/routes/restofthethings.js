export default function restofthethings(app) {
  var valid_url = /\/[a-z~!@#$%^&*()_+`0-9-=\[\]\\{}|:";'<>,/]*(?:\?|#=.*)?$/i // eslint-disable-line
  app.get(valid_url, (req, res) => {
    function getData(route) {
      var view = app.locals.pages
      var route_nodes = route.slice(1).split('/')

      for (var i = 0; i < route_nodes.length; i++) {
        if (view.toString().slice(8, -1) !== 'Object') {
          break
        }

        view = view[route_nodes[i]]
      }

      return view && view.page
    }

    res.render('index', getData(req.path))
  })
}
