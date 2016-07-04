/**
 * Transmits project files / .zip package to remote server via ftp
 * Dependencies:
 * - vinyl-ftp
 * - gulp-prompt
 * - run-sequence
 */

var gulp = require('gulp');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');
var prompt = require('gulp-prompt');
var runSequence = require('run-sequence');
var config = require('../../config').ftp;
var credentials = require('../../credentials').ftp;

gulp.task('ftp', function() {
    var ftpOptions = {
        host: credentials.host,
        user: credentials.username,
        password: credentials.password,
        log: gutil.log
    };

    // merge ftp credentials with ftp config options
    Object.keys(config.options).forEach(function(key) { ftpOptions[key] = config.options[key]; });

    var conn = ftp.create(ftpOptions);

    return gulp.src('').pipe(
        prompt.prompt({
            type: 'checkbox',
            name: 'zip_upload',
            message: 'Upload entire directory in .zip format? If no, only modified files will be uploaded',
            choices: ['no', 'yes']
        }, function(result) {
            var choice = result.zip_upload[0];

            if (choice === 'no') {
                return gulp.src(config.src, { base:config.base, buffer:false })
                    .pipe(conn.newer(credentials.directory))
                    .pipe(conn.dest(credentials.directory));
            } else if (choice === 'yes') {
                runSequence('zip', function() {
                    return gulp.src('./' + global.zipFileName, { base:'.', buffer:false })
                        .pipe(conn.dest(credentials.directory));
                });
            }
        })
    );
});