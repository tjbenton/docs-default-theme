module.exports = function(routes, log) {
  log = log !== undefined ? log : true
  var Table = require('cli-table');
  var table = new Table({
    head: [ 'Type', 'Name', 'Path' ]
  });

  log && console.log('\nAPI for this service \n');
  log && console.log('\n********************************************');
  log && console.log('\t\tEXPRESS');
  log && console.log('********************************************\n');
  for (var key in routes) {
    if (routes.hasOwnProperty(key)) {
      var val = routes[key];
      if (val.route) {
        val = val.route;
        var _o = {};
        _o[val.stack[0].method] = [val.path, val.path];
        table.push(_o);
      }
    }
  }

  log && console.log(table.toString());

  return table;
}