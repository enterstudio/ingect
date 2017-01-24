(function(global) {
  'use strict';

  global.G = function(opts = {}) {
    const resolve = function(store, moduleName) {
      if((typeof store[moduleName]) !== 'object') {
        throw new Error(`${ moduleName } is not defined`);
      }

      const deps = [];
      let module = store[moduleName].resolved;

      if(module === undefined) {
        store[moduleName].deps.forEach(function(depName) {
          if(depName === '$global') {
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

    const injector = function(moduleName, module, deps = []) {

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
