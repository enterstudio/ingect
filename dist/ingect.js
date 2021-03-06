/*
  ingect v0.0.6
  

  @author:  Pasquale Boemio <boemianrapsodi@gmail.com>
  @license: MIT
*/

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
  return typeof obj;
} : function(obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

(function(global) {
  'use strict';

  global.G = function() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var resolve = function resolve(store, moduleName) {
      if (_typeof(store[moduleName]) !== 'object') {
        throw new Error(moduleName + ' is not defined');
      }

      var deps = [];
      var module = store[moduleName].resolved;

      if (module === undefined) {
        store[moduleName].deps.forEach(function(depName) {
          if (depName === '$global') {
            deps.push(global);
            return;
          }

          deps.push(resolve(store, depName));
          return;
        });

        module = store[moduleName].module.apply(null, deps);
        store[moduleName].resolved = module;
      }

      return module;
    };

    var _modules = new Proxy({}, {
      get: function get(target, key) {
        return resolve(target, key);
      },
      set: function set(target, key, value) {
        if (target[key] !== undefined) {
          throw new Error('A module with the name ' + key + ' already exists');
        }

        target[key] = value;

        return true;
      }
    });

    var injector = function injector(moduleName, module) {
      var deps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];


      if (arguments.length === 1) {
        return _modules[moduleName];
      }

      _modules[moduleName] = {
        module: module,
        deps: deps
      };
    };

    return injector;
  };
})(this);