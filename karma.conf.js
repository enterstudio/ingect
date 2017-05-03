const _src = 'src/**/*.js';
const _test = 'test/**/*.test.js';

module.exports = function(c) {

  c.set({

    files: [
      _src,
      _test
    ],

    coverageReporter: {
      dir: 'dist/reports/',
      reporters: [
        { type: 'text' },
        { type: 'lcovonly', file: 'coverage.lcov' }
      ]
    },

    frameworks: [ 'mocha', 'chai' ],

    colors: true,

    background: false,

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: [ '--no-sandbox' ]
      }
    },

    browsers: [ 'Chrome_travis_ci', 'Firefox' ],

    jshint: {
      options: {
        esversion: 6
      }
    },

    babelPreprocessor: {
      options: {
        presets: ['es2015-script'],
        sourceMap: 'inline'
      },
      filename: function(file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function(file) {
        return file.originalPath;
      }
    },

    preprocessors: {
      [ _src ]: [ 'jshint', 'babel' ],
      [ _test ]: [ 'jshint', 'babel' ]
    },

  });

};
