/**
 *  Start browsersync task and watch for file changes
 */

var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var config = require('../../config').watch;

gulp.task('watch', ['browsersync'], function() {
    // gulp.watch(config.custom, ['rebuild']);
    // gulp.watch(config.scripts, ['concat:js', 'jshint']);
    // gulp.watch(config.sprites, ['sprites']);
    watch(config.sass, batch(function(events, callback) {
        gulp.start('sass', callback);
        gulp.start('scsslint', callback);
    }));

    watch(config.scripts, batch(function(events, callback) {
        gulp.start('scripts', callback);
        gulp.start('jshint', callback);
    }));
});