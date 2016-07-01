/**
 *  Run the build task and start a server with Browsersync
 *  Dependencies:
 *  - browser-sync
 */

var gulp = require('gulp');
var browsersync = require('browser-sync').create('Prod Server');
var config = require('../../config').browsersync.production;

gulp.task('browsersync:production', ['build:production'], function() {
    browsersync.init(config);
});