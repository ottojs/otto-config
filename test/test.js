
'use strict';

// Modules
require('should');

// http://stackoverflow.com/questions/2648293/javascript-get-function-name
function function_name (fun) {
  var ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}

// Subject
var config = require('../lib/index.js');

var default_app = {
  set : function () {},
  use : function () {}
};

describe('Config', function () {

  describe('.global()', function () {

    describe('environment', function () {

      it('should default to PRODUCTION', function () {
        var environment = config.global(default_app);
        environment.should.equal('PRODUCTION');
      });

      it('should be identical when an environment object is given', function () {
        var environment = config.global(default_app, { NODE_ENV : 'SOME-ENVIRONMENT' });
        environment.should.equal('SOME-ENVIRONMENT');
      });

      it('should accept a string as an environment', function () {
        var environment = config.global(default_app, 'STRING');
        environment.should.equal('STRING');
      });

      it('should not accept a number as an environment', function () {
        var environment = config.global(default_app, 12345);
        environment.should.equal('PRODUCTION');
      });

    });

    describe('port', function () {

      it('should default to 3000', function () {
        var settings = {};
        config.global({
          use : function () {},
          set : function (key, value) {
            settings[key] = value;
          }
        });
        settings.should.have.property('port').and.equal(3000);
      });

      it('should use default of 3000 when given an invalid integer', function () {
        var settings = {};
        config.global({
          use : function () {},
          set : function (key, value) {
            settings[key] = value;
          }
        }, { PORT : 'eighty' });
        settings.should.have.property('port').and.equal(3000);
      });

      it('should use the custom port when given an integer string', function () {
        var settings = {};
        config.global({
          use : function () {},
          set : function (key, value) {
            settings[key] = value;
          }
        }, { PORT : '1234' });
        settings.should.have.property('port').and.equal(1234);
      });

      it('should use the custom port when given an integer number', function () {
        var settings = {};
        config.global({
          use : function () {},
          set : function (key, value) {
            settings[key] = value;
          }
        }, { PORT : 5678 });
        settings.should.have.property('port').and.equal(5678);
      });

    });

    describe('views', function () {

      it('should not use views by default', function () {
        var settings = {};
        config.global({
          use : function () {},
          set : function (key, value) {
            settings[key] = value;
          }
        }, {}, {});
        settings.should.not.have.property('view engine');
        settings.should.not.have.property('views');
      });

      it('should use the provided path for the views', function () {
        var settings = {};
        config.global({
          use : function () {},
          set : function (key, value) {
            settings[key] = value;
          }
        }, {}, {
          views : {
            path : '/path/to/views'
          }
        });
        settings.should.have.property('views').and.equal('/path/to/views');
      });

      it('should use ejs as the default view engine type', function () {
        var settings = {};
        config.global({
          use : function () {},
          set : function (key, value) {
            settings[key] = value;
          }
        }, {}, {
          views : {
            path : '/path/to/views'
          }
        });
        settings.should.have.property('view engine').and.equal('ejs');
      });

      it('should use a custom engine when provided', function () {
        var settings = {};
        config.global({
          use : function () {},
          set : function (key, value) {
            settings[key] = value;
          }
        }, {}, {
          views : {
            type : 'custom',
            path : '/path/to/views'
          }
        });
        settings.should.have.property('view engine').and.equal('custom');
      });

    });

    describe('logger', function () {

      it('should not run a logger at all in DEFAULT environment', function () {

        var called = false;
        config.global({
          set : function () {},
          use : function (middleware) {
            if (function_name(middleware) === 'logger') {
              called = true;
            }
          }
        }, { NODE_ENV : 'DEFAULT' });

        called.should.equal(false);

      });

      it('should not run a logger by default in DEVELOPMENT environment', function () {

        var called = false;
        config.global({
          set : function () {},
          use : function (middleware) {
            if (function_name(middleware) === 'logger') {
              called = true;
            }
          }
        }, { NODE_ENV : 'DEVELOPMENT' });

        called.should.equal(false);

      });

      it('should run a logger when asked in DEVELOPMENT environment', function () {

        var called = false;
        config.global({
          set : function () {},
          use : function (middleware) {
            if (function_name(middleware) === 'logger') {
              called = true;
            }
          }
        }, { NODE_ENV : 'DEVELOPMENT' }, { logging : true });

        called.should.equal(true);

      });

    });

  });

});
