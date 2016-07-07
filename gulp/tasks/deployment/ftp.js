/**
 * Transmits project files / .zip package to remote server via ftp
 * Dependencies:
 * - vinyl-ftp
 * - gulp-prompt
 * - run-sequence
 * - del
 */

var gulp = require('gulp');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');
var prompt = require('gulp-prompt');
var runSequence = require('run-sequence');
var config = require('../../config').ftp;
var credentials = require('../../credentials').ftp;
var del = require('del');

var ftpConn;

gulp.task('ftp', function(callback) {
    var isWin = /^win/.test(process.platform);
    var sequenceTasks = ['zip', 'upload'];

    // Windows does not work well with gulp-prompt it seems. So on Windows, we skip the prompt altogther and upload a zip file.
    if (isWin) {
        runSequence.apply(null, [].concat(sequenceTasks, function() {
            del(['./' + global.zipFileName]);
        }));
    } else {
        return gulp.src('').pipe(
            prompt.prompt({
                type: 'checkbox',
                name: 'zip_upload',
                message: 'Upload entire directory in .zip format? If no, only modified files will be uploaded',
                choices: ['yes', 'no']
            }, function(result) {
                ftpConn = createFTPConnection();
                var choice = result.zip_upload[0];

                if (choice === 'no') {
                    return gulp.src(config.src, { base:config.base, buffer:false })
                        .pipe(ftpConn.newer(credentials.directory))
                        .pipe(ftpConn.dest(credentials.directory));
                } else if (choice === 'yes') {
                    runSequence.apply(null, [].concat(sequenceTasks, function() {
                        del(['./' + global.zipFileName]);
                    }));
                }
            })
        );
    }
});

gulp.task('upload', function() {
    ftpConn = ftpConn || createFTPConnection();

    return gulp.src('./' + global.zipFileName, { base:'.', buffer:false })
        .pipe(ftpConn.dest(credentials.directory));
});

function createFTPConnection() {
    var ftpOptions = {
        host: credentials.host,
        user: credentials.username,
        password: credentials.password,
        log: gutil.log
    };

    // merge ftp credentials with ftp config options
    Object.keys(config.options).forEach(function(key) { ftpOptions[key] = config.options[key]; });
    return ftp.create(ftpOptions);
}