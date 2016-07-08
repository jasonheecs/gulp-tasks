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
    var sqlDumpFilePath = config.dest + config.filename;
    var shellCommand = getSqlDumpCommand(sqlDumpFilePath);

    if (credentials.ssh) { //if ssh credentials are present (i.e: using vagrant box)
        var gulpSSH = new GulpSSH({
          ignoreErrors: false,
          sshConfig: credentials.ssh
        });

        return gulpSSH
            .exec([shellCommand],{filePath: sqlDumpFilePath})
            .pipe(gulp.dest('./'))
            .pipe(gnotify({
                title: 'Database exported',
                message: 'Database dump located at ' + sqlDumpFilePath
            }));
    }

    var isWin = /^win/.test(process.platform);
    var mkdir = '';

    if (isWin) {
        mkdir = exec('if not exist ".\databases\NUL" mkdir databases');
    } else {
        mkdir = exec('mkdir -p databases');
    }
    
    mkdir.on('close', function(code) {
        if (code === 0 || (isWin && code === 1)) { // process executed successfully, on Windows, if dir already exists, the mkdir will exit with a code of 1
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

/**
 * Generates the shell command for mysqldump depending on if there is a blank password / using GulpSSH.
 * @return {string} mysqldump shell command
 */
function getSqlDumpCommand(sqlDumpFilePath) {
    var shellCommand;

    if (credentials.ssh) {
        if (credentials.password.length === 0) {
            shellCommand = util.format('mysqldump -u %s -h %s %s', 
                                        credentials.username, credentials.host, credentials.db_name);
        } else {
            shellCommand = util.format('mysqldump -u %s -p%s -h %s %s', 
                                        credentials.username, credentials.password, credentials.host, credentials.db_name);
        }
    } else {
        if (credentials.password.length === 0) {
            shellCommand = util.format('mysqldump -u %s -h %s %s > %s', 
                                            credentials.username, credentials.host, credentials.db_name, '.'  + sqlDumpFilePath);
        } else {
            shellCommand = util.format('mysqldump -u %s -p%s -h %s %s > %s', 
                                            credentials.username, credentials.password, credentials.host, credentials.db_name, '.'  + sqlDumpFilePath);
        }
    }

    return shellCommand;
}