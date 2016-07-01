/**
 * Optimise image file sizes
 * Dependencies:
 *  - gulp-imagemin
 *  - gulp-size
 *  - imagemin-pngquant
 *  - imagemin-jpeg-recompress
 */

var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var size = require('gulp-size');
var config = require('../../config').optimise.images;

gulp.task('optimise:images', function() {
    var setsLength = config.sets.length;

    var optimiseImage = function(imageSet) {
        //configure plugins for imagemin
        var pluginsConfig = config.plugins;
        var pngPlugin = require(pluginsConfig.png.name);
        var jpgPlugin = require(pluginsConfig.jpg.name);
        config.options.use = [pngPlugin(pluginsConfig.png.options),jpgPlugin(pluginsConfig.jpg.options)];

        return gulp.src(imageSet.src)
            .pipe(imagemin(config.options))
            .pipe(size({title: imageSet.title, showFiles:false}))
            .pipe(gulp.dest(imageSet.dest));
    };

    // optimise all image sets
    config.sets.forEach(optimiseImage);
});