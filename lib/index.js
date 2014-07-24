
'use strict';

// Modules
var path            = require('path');
var logger          = require('morgan');
var body_parser     = require('body-parser');
var method_override = require('method-override');

var defaults = {
  port : 3000
};

// Exports
module.exports = {

  global : function (app, environment) {

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
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    // Log Requests
    if (environment.NODE_ENV === 'DEVELOPMENT') {
      console.log('Starting Logger...');
      // Long version of 'dev'
      app.use(logger(':date :remote-addr :method :status :url'));
    }

    // Accept Method Overrides
    // in order to be compatible
    // with limited clients/browsers
    app.use(method_override('_method'));

    // NOTE: This only parses JSON bodies (application/json)
    // If you need urlencoded (x-www-form-urlencoded)
    // or multipart (multipart/form-data), you'll need to add them
    // See README here: https://github.com/expressjs/body-parser

    // Parse POST/PUT Body
    app.use(body_parser.json());

    return environment.NODE_ENV;

  }

};
