/**
 *  Rebuilds and reloads browsersync
 *  Dependecies:
 *  - browser-sync
 */

var gulp = require('gulp');
var browsersync = require('browser-sync').get('Dev Server');

gulp.task('rebuild', function() {
    browsersync.reload();
});