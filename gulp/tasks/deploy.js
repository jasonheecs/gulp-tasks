/**
 *  Start tasks for deployment
 *  Dependencies:
 *  - Browsersync
 */

var gulp = require('gulp');

gulp.task('deploy', ['ftp', 'db-export']);