/**
 * Exports database as a sql dump into the databases folder.
 * Dependencies:
 * - gulp-ssh
 * - gulp-notifier
 */

var gulp = require('gulp');
var util = require('util');
var GulpSSH = require('gulp-ssh');
var notification = require('../../util/notification');
var gnotify = require('gulp-notify');
var exec = require('child_process').exec;
var credentials = require('../../credentials').db.local;
var config = require('../../config').db.export;
var inquirer = require('inquirer');

gulp.task('db:import', function(callback) {
    var sqlDumpFilePath = config.dest + config.filename;
    var shellCommand = getSqlDumpCommand(sqlDumpFilePath);

    if (credentials.ssh) { //if ssh credentials are present (i.e: using vagrant box)
        var gulpSSH = new GulpSSH({
          ignoreErrors: false,
          sshConfig: credentials.ssh
        });

        inquirer.prompt([{
            type: 'input',
            name: 'database_file',
            message: 'What is the filename (including any sub-directory path) of the .sql file?',
            validate: function (value) {
                var fileExtension = value.split('.').pop();
                if (fileExtension !== 'sql') {
                    return 'Invalid file! File needs to end in .sql';
                }

                return true;
            }
        }]).then(function (answers) {
            return gulpSSH
                .exec([shellCommand],{filePath: answers.database_file})
                .pipe(gulp.dest('logs'))
                .pipe(gnotify({
                    title: 'Database exported',
                    message: 'Database dump located at ' + sqlDumpFilePath
                }));

            // callback();
        });
    }

    // var isWin = /^win/.test(process.platform);
    // var mkdir = '';

    // if (isWin) {
    //     mkdir = exec('if not exist ".\databases\NUL" mkdir databases');
    // } else {
    //     mkdir = exec('mkdir -p databases');
    // }
    
    // mkdir.on('close', function(code) {
    //     if (code === 0 || (isWin && code === 1)) { // process executed successfully, on Windows, if dir already exists, the mkdir will exit with a code of 1
    //         exec(shellCommand, function (err, stdout, stderr) {
    //             if (!err) {
    //                 // use node notifier instead of gulp notifer here because not using gulp stream.
    //                 // feels more right this way, rather than hacking a solution.
    //                 notification.notify('Database exported',
    //                                     'Database dump located at ' + sqlDumpFilePath);
    //             }

    //             callback(err);
    //         });
    //     }
    // });
});

/**
 * Generates the shell command for mysqldump depending on if there is a blank password / using GulpSSH.
 * @return {string} mysqldump shell command
 */
function getSqlDumpCommand(sqlDumpFilePath) {
    var shellCommand;

    if (credentials.ssh) {
        if (credentials.password.length === 0) {
            shellCommand = util.format('mysql -u %s -h %s %s', 
                                        credentials.username, credentials.host, credentials.db_name);
        } else {
            shellCommand = util.format('mysql -u %s -p%s -h %s %s', 
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