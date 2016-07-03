/**
 *  Minify and optimise css file(s)
 *  Dependencies:
 *  - gulp-cssnano
 *  - gulp-size
 *  - gulp-csscomb
 *  - gulp-merge-media-queries
 *  - run-sequence
 */

var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var csscomb = require('gulp-csscomb');
var runSequence = require('run-sequence');
var mmq = require('gulp-merge-media-queries');
var config = require('../../config').optimise.css;
var size = require('gulp-size');

// run the base64 task as a dependency if the optimise:css task is run from the command line
gulp.task('optimise:css', function(callback) {
    runSequence(
        'sass',
        'base64::run',
        'optimise:css::run'
    );
});

// run this task for optimising css during gulp build (to avoid running the sass task twice in the initial build)
gulp.task('optimise:css::run', function() {
    return gulp.src(config.src)
        .pipe(mmq())
        .pipe(csscomb())
        .pipe(cssnano(config.options))
        .pipe(gulp.dest(config.dest))
        .pipe(size({title: 'Optimised CSS Files', showFiles:true}));
});