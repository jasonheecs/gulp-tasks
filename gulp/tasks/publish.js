/**
 *  Start Browsersync task for production build
 *  Dependencies:
 *  - Browsersync
 */

var gulp = require('gulp');

gulp.task('publish', ['browsersync:production']);