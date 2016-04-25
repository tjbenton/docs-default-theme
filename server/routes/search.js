export default function search(app) {
  // Routes
  app.get('/search', (req, res) => {
    res.render('search/index', {})
  })
}
