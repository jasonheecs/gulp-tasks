var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var config = require('../../config').concatJs;

gulp.task('concat-js', function() {
  return gulp.src(config.src)
    .pipe(sourcemaps.init())
    .pipe(concat('custom.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.dest));
});