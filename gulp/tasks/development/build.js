/**
 *  Run all tasks needed for a build in a defined order
 *  Dependencies:
 *  - run-sequence
 */

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('build', function(callback) {
    runSequence(
        'sprites',
        [
            'sass',
            'scripts'
        ],
        callback
    );
});