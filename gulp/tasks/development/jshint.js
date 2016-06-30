/**
 *  Use jshint to check syntax of js files
 *  Dependencies:
 *      - jshint
 *      - gulp-jshint
 *      - jshint-stylish
 *      - gulp-cached
 */

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var cache = require('gulp-cached');
var config = require('../../config').jshint;

gulp.task('jshint', function() {
    return gulp.src(config.src)
        .pipe(cache('jshint'))
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});