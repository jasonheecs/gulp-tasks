/**
 * Run all tasks need for a production build
 * Dependencies:
 * - run-sequence
 */

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('build:production', function(callback) {
    runSequence(
        'sprites',
        [
            'sass',
            'scripts',
            'favicon'
        ],
        'base64::run',
        [
            'optimise:css::run',
            'optimise:js::run',
            'optimise:images'
        ],
        callback
    );
});