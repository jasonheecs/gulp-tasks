/**
 *  Run the build task and start a server with Browsersync
 *  Dependencies:
 *  - browser-sync
 */

var gulp = require('gulp');
var browsersync = require('browser-sync').create('Dev Server');
var config = require('../../config').browsersync.development;

gulp.task('browsersync', ['build'], function() {
    browsersync.init(config);
});