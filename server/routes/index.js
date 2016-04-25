import search from './search.js'
import restofthethings from './restofthethings.js'

export default function routes(app) {
  search(app)
  restofthethings(app)
}
