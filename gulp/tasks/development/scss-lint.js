/**
 *  Lint SCSS files
 *  Dependencies:
 *   -  scss-lint ruby gem (gem install scss_lint)
 *   -  gulp-scss-lint
 *   -  gulp-cached
 */

var gulp = require('gulp');
var scsslint = require('gulp-scss-lint');
var cache = require('gulp-cached');
var config = require('../../config').scsslint;

gulp.task('scsslint', function() {
    return gulp.src(config.src)
        .pipe(cache('scsslint'))
        .pipe(scsslint(config.options));
});