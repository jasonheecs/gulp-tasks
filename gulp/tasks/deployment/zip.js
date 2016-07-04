/**
 *  Zip all files and folders in development directory
 *  Dependencies:
 *  - gulp-vinyl-zip
 */

var gulp = require('gulp');
var zip = require('gulp-vinyl-zip');
var config = require('../../config').zip;

gulp.task('zip', function() {
    global.zipFileName = config.dest;
    
    return gulp.src(config.src)
        .pipe(zip.dest(global.zipFileName));
});