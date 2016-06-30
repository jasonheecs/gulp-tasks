/**
 *  Convert small background images used in css files (those within a url( ... ) declaration) into base64-encoded data URI strings. 
 *  Dependencies:
 *   - gulp-base64
 *   - gulp-cached
 */

var gulp = require('gulp');
var base64 = require('gulp-base64');
var cache = require('gulp-cached');
var config = require('../../config').base64;

gulp.task('base64', ['sass'], function() {
    return gulp.src(config.src)
        .pipe(cache('base64'))
        .pipe(base64(config.options))
        .pipe(gulp.dest(config.dest));
});