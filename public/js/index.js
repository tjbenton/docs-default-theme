// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function() {
  var cache = {};

  this.tmpl = function tmpl(str, data) {
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    // var fn;
    if (!/\W/.test(str)) {
      fn = cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML)
    } else {
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      fn =  new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');")
    }

    // Provide some basic currying to the user
    return data ? fn(data) : fn;
  };
})();

(function () {
  // A hash to store our routes:
  var routes = {};
  // The route registering function:
  function route (path, templateId, controller) {
    // Allow route(path, controller) for template less routes:
    if (typeof templateId === 'function') {
      controller = templateId;
      templateId = null;
    }
    routes[path] = { templateId: templateId, controller: controller };
  }
  var el = null, current = null;

  function router () {
    // Current route url (getting rid of '#' in hash as well):
    var url = location.hash.slice(1) || '/';

    // Get route by url:
    var route = routes[url];

    // Is it a route without template?
    if (route && !route.templateId) {
      // Just initiate controller:
      return route.controller ? new route.controller : null;
    }

    // Lazy load view element:
    el = el || document.getElementById('view');

    // Clear existing observer:
    if (current) {
      Object.unobserve(current.controller, current.render);
      current = null;
    }

    // Do we have both a view and a route?
    if (el && route && route.controller) {
      // Set current route information:
      current = {
        controller: new route.controller,
        template: tmpl(route.templateId),
        render: function () {
          // Render route template with John Resig's template engine:
          el.innerHTML = this.template(this.controller);
        }
      };
      // Render directly:
      current.render();
      // And observe for changes:
      Object.observe(current.controller, current.render.bind(current));
    }
  }
  // Listen on hash change:
  this.addEventListener('hashchange', router);
  // Listen on page load:
  this.addEventListener('load', router);
  // Expose the route register function:
  this.route = route;
})();