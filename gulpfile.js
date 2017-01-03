const gulp = require('gulp');
const beautify = require('gulp-jsbeautifier');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const header = require('gulp-header');
const sourcemaps = require('gulp-sourcemaps');
const KarmaServer = require('karma').Server;
const path = require('path');

const _pkg = require(path.join(__dirname, 'package'));

const _src = ['src/**/*.js'];
const _bundle = `${_pkg.name}.js`;
const _bundleMin = `${_pkg.name}.min.js`;
const _dist = 'dist/';

const bundleHeader = `
\/\*
  ${_pkg.name} v${_pkg.version}
  ${_pkg.description}

  @author:  ${_pkg.author}
  @license: ${_pkg.license}
\*\/

`

gulp.task('build', function() {
  return gulp.src(_src).pipe(babel({
    presets: ['es2015-script']
  })).pipe(header(bundleHeader)).pipe(beautify({
    indent_size: 2
  })).pipe(sourcemaps.init()).pipe(gulp.dest(_dist)).pipe(uglify()).pipe(rename(_bundleMin)).pipe(sourcemaps.write('./')).pipe(gulp.dest(_dist));
});

gulp.task('test', function(done) {
  new KarmaServer({
    configFile: path.join(__dirname, 'karma.conf.js'),
    reporters: ['dots', 'coverage'],
    singleRun: true,
    autoWatch: false
  }, done).start();
});

gulp.task('develop', function(done) {
  new KarmaServer({
    configFile: path.join(__dirname, '/karma.conf.js'),
    reporters: ['dots'],
    singleRun: false,
    autoWatch: true
  }, done).start();
});
