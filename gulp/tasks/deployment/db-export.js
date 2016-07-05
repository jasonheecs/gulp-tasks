/**
 * Exports database as a sql dump into the databases folder.
 * Dependencies:
 * - gulp-ssh
 * - gulp-notifier
 * - node-notifier
 */

var gulp = require('gulp');
var util = require('util');
var GulpSSH = require('gulp-ssh');
var notifier = require('node-notifier');
var gnotify = require('gulp-notify');
var exec = require('child_process').exec;
var credentials = require('../../credentials').db.local;
var config = require('../../config').db.export;

gulp.task('db:export', function(callback) {
    var shellCommand;
    var sqlDumpFilePath = config.dest + config.filename;

    if (credentials.ssh) { //if ssh credentials are present (i.e: using vagrant box)
        var gulpSSH = new GulpSSH({
          ignoreErrors: false,
          sshConfig: credentials.ssh
        });

        shellCommand = util.format('mysqldump -u %s -p%s -h %s %s', 
                                    credentials.username, credentials.password, credentials.host, credentials.db_name);

        return gulpSSH
            .exec([shellCommand],{filePath: sqlDumpFilePath})
            .pipe(gulp.dest('./'))
            .pipe(gnotify({
                title: 'Database exported',
                message: 'Database dump located at ' + sqlDumpFilePath
            }));
    }

    shellCommand = util.format('mysqldump -u %s -p%s -h %s %s > %s', 
                                    credentials.username, credentials.password, credentials.host, credentials.db_name, '.'  + sqlDumpFilePath);

    var mkdir = exec('mkdir -p databases');
    mkdir.on('close', function(code) {
        if (code === 0) { // process executed successfully
            exec(shellCommand, function (err, stdout, stderr) {
                if (!err) {
                    // use node notifier instead of gulp notifer here because not using gulp stream.
                    // feels more right this way, rather than hacking a solution.
                    notifier.notify({
                      title: 'Database exported',
                      message: 'Database dump located at ' + sqlDumpFilePath,
                      sound: true
                    });
                }

                callback(err);
            });
        }
    });
});