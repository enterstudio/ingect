(function(global) {
  'use strict';

  global.G = function() {
    const resolve = function(store, moduleName) {
      if((typeof store[moduleName]) !== 'object') {
        throw new Error(`${ moduleName } is not defined`);
      }

      const deps = [];

      if(store[moduleName].resolved === undefined) {
        store[moduleName].deps.forEach(function(depName) {
          if(typeof(store[depName]) === 'object') {
            deps.push(resolve(store, depName));
            return;
          }

          if(window[depName] !== undefined) {
            deps.push(window[depName]);
            return;
          }

          throw new Error(`${ depName } is an invalid dependency for module ${ moduleName }`);
        });

        store[moduleName].resolved = store[moduleName].module.apply(null, deps);
      }

      return store[moduleName].resolved;
    };

    const _modules = new Proxy({}, {
      get: function(target, key) {
        return resolve(target, key);
      },
      set: function(target, key, value) {
        if(target[key] !== undefined) {
          throw new Error(`A module with the name ${ key } already exists`);
        }

        target[key] = value;

        return true;
      }
    });

    var injector = function(moduleName, module, deps = []) {

      if(arguments.length === 1) {
        return _modules[moduleName];
      }

      _modules[moduleName] = {
        module,
        deps
      };

    };

    return injector;
  };

})(this);
