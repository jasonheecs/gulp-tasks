/**
 * Minify JS files
 * Dependencies:
 *  - gulp-uglify
 *  - gulp-size
 *  - gulp-strip-debug
 */

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var stripDebug = require('gulp-strip-debug');
var size = require('gulp-size');
var config = require('../../config').optimise.js;

// run the scripts task as a dependency if the optimise:js task is run from the command line
gulp.task('optimise:js', ['concat-js'], function() {
    gulp.start('optimise:js::run');
});

// run this task for optimising js files during gulp build (to avoid running the scripts task twice in the initial build)
gulp.task('optimise:js::run', function() {
    return gulp.src(config.src)
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest(config.dest))
        .pipe(size({title: 'Optimised JS Files', showFiles:true}));
});