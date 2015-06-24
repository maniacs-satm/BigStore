'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

module.exports = function(options) {

  gulp.task('html', function () {


    var htmlFilter = $.filter('*.html');
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var sources = gulp.src([options.src + '/**/*.js', options.src + '/**/*.css'], {read: false});

    var assets;
    var wiredep = require('wiredep').stream;


      return gulp.src(options.src + '/index.html')
        .pipe($.inject(sources))
        .pipe(assets = $.useref.assets({searchPath: './'}))
        .pipe(cssFilter)
        .pipe($.minifyCss())
        .pipe(cssFilter.restore())
        .pipe(jsFilter)
        //.pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(assets.restore())
        .pipe($.useref())
          .pipe(wiredep())
        .pipe(gulp.dest(options.dist + '/'));
  });

  gulp.task('clean', function (done) {
    $.del([options.dist + '/'], done);
  });

  gulp.task('build', ['html']);
};
