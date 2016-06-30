/**
 * Gulp Task to generate CSS from SCSS
 * Dependencies:
 *   - browser-sync
 *   - gulp-sass
 *   - gulp-sourcemaps
 *   - gulp-autoprefixer
 *   - gulp-cached
 */

var gulp = require('gulp');
var browsersync = require('browser-sync').get('Dev Server');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var cache = require('gulp-cached');
var handleErrors = require('../../util/handleErrors');
var config = require('../../config');

gulp.task('sass', function() {
    var sassConfig = config.sass;
    sassConfig.onError = browsersync.notify;

    browsersync.notify('Compiling Sass');

    return gulp.src(sassConfig.src)
        .pipe(cache('sass'))
        .pipe(sourcemaps.init())
        .pipe(sass(sassConfig.options).on('error', handleErrors))
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(sassConfig.dest));
});