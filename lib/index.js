
'use strict';

// Modules
var logger          = require('morgan');
var cookie_parser   = require('cookie-parser');
var body_parser     = require('body-parser');
var method_override = require('method-override');
var response_time   = require('response-time');

var defaults = {
  port : 3000
};

// Exports
module.exports = {

  global : function (app, environment, config) {

    // Default Config
    if (!config) {
      config = { logging : false };
    }

    // Interpret Environment
    if (!environment) { environment = {}; }
    if (typeof environment === 'string') { environment = { NODE_ENV : environment }; }
    if (typeof environment !== 'object') { environment = {}; }

    // Assume Production
    if (!environment.NODE_ENV) { environment.NODE_ENV = 'PRODUCTION'; }

    // Set Port
    var port = defaults.port;
    if (environment.PORT) {
      var port_parsed = parseInt(environment.PORT, 10);
      if (!isNaN(port_parsed)) {
        port = port_parsed;
      }
    }
    app.set('port', port);

    // Set View Options
    if (config.views) {

      // Only Supporting EJS for now
      if (config.views.type !== 'ejs') {
        console.log('Only Supporting EJS for Server-Side Templates');
        config.views.type = 'ejs';
      }

      // Load Engine
      app.engine('.ejs', require('ejs').__express);
      app.set('view engine', config.views.type);
      app.set('views', config.views.path);

    }

    // Log Requests
    if (environment.NODE_ENV === 'DEVELOPMENT') {
      if (config.logging === true) {
        // Long version of 'dev'
        app.use(logger(':date :remote-addr :method :status :url'));
      }
    }

    // Proxy / Load Balancer
    if (!config.trust_proxy) { config.trust_proxy = false; }
    app.set('trust proxy', config.trust_proxy);

    // Response Time Header
    if (!config.response_time) { config.response_time = false; }
    if (config.response_time) {
      app.use(response_time({ header : config.response_time }));
    }

    // Powered-By Header
    app.use(function (req, res, next) {
      if (!options.powered_by) {
        // Remove the Header
        app.disable('x-powered-by');
        //res.removeHeader('x-powered-by');
      } else {
        res.setHeader('X-Powered-By', options.powered_by);
      }
      next();
    });

    // Accept Method Overrides
    // in order to be compatible
    // with limited clients/browsers
    app.use(method_override('_method'));

    // Parse Cookie
    if (config.parse_cookies !== false) {
      app.use(cookie_parser());
    }

    // NOTE: This only parses JSON bodies (application/json)
    // If you need multipart (multipart/form-data), you'll need to add it
    // See README here: https://github.com/expressjs/body-parser

    // Parse Body
    if (config.body_json !== false) {
      app.use(body_parser.json());
    }
    if (config.body_urlencoded !== false) {
      app.use(body_parser.urlencoded({ extended: false }));
    }

    return environment.NODE_ENV;

  }

};
