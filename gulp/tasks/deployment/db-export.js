var gulp = require('gulp');
var util = require('util');
var shell = require('gulp-shell');
var credentials = require('../../credentials').db.local;

gulp.task('db:export', function() {
    var shellCommand = util.format('mysqldump -u %s -p%s -h %s %s > db_export.sql', 
                                    credentials.username, credentials.password, credentials.host, credentials.db_name);

    return gulp.src('').pipe(shell(shellCommand));
});