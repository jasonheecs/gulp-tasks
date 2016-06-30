/**
 * Bundles Javascript modules via Browserify
 * Dependencies:
 *   - browser-sync
 *   - browserify
 *   - vinyl-source-stream
 *   - watchify
 *   - gulp-sourcemaps
 *   - vinyl-buffer
 *   - gulp-cached
 */

var gulp = require('gulp');
var browsersync = require('browser-sync').get('Dev Server');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var sourcemaps = require('gulp-sourcemaps');
var vbuffer = require('vinyl-buffer');
var cache = require('gulp-cached');
var bundleLogger = require('../../util/bundleLogger');
var handleErrors = require('../../util/handleErrors');
var config = require('../../config').browserify;

//
//  Run JS through Browserify
//
gulp.task('scripts', function(callback) {
    browsersync.notify('Compiling Javascript');

    var bundleQueue = config.bundleConfigs.length;

    var browserifyThis = function(bundleConfig) {
        var bundler = browserify({
            //required watchify args
            cache: {}, packageCache: {}, fullPaths: false,
            //entry point of app
            entries: bundleConfig.entries,
            //optional file extensions in requires
            extensions: config.extensions,
            //enable source maps
            debug: config.debug
        });

        var bundle = function() {
            //log when bundling starts
            bundleLogger.start(bundleConfig.outputName);

            if (config.debug) { //write source maps
                return bundler
                    .bundle()
                    .on ('error', handleErrors) //report compile errors
                    .pipe(source(bundleConfig.outputName)) //use vinyl-source-stream to make stream gulp compatible. Specify desired output filename here.
                    .pipe(cache('scripts'))
                    .pipe(vbuffer())
                    .pipe(sourcemaps.init({loadMaps: true}))
                    .pipe(sourcemaps.write('./'))
                    .pipe(gulp.dest(bundleConfig.dest))
                    .on('end', reportFinished);
            }

            return bundler
                .bundle()
                .on ('error', handleErrors) //report compile errors
                .pipe(source(bundleConfig.outputName)) //use vinyl-source-stream to make stream gulp compatible. Specify desired output filename here.
                .pipe(cache('scripts'))
                .pipe(gulp.dest(bundleConfig.dest))
                .on('end', reportFinished);
        };

        if (global.isWatching) {
            //wrap with watchify and rebundle on changes
            bundler = watchify(bundler);
            //rebundle on update
            bundler.on('update', bundle);
        }

        var reportFinished = function() {
            //Log when bundling completes
            bundleLogger.end(bundleConfig.outputName);

            if (bundleQueue) {
                bundleQueue--;
                if (bundleQueue === 0) {
                    // If queue is empty, tell gulp the task is complete.
                    // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
                    callback();
                }
            }
        };

        return bundle();
    };

    //start bundling with Browserify for each bundleConfig
    config.bundleConfigs.forEach(browserifyThis);
});