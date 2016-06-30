/*jshint esversion: 6*/

/**
 *  Config file used for gulp tasks
 */

var build               = 'public'; // development directory (where website in development with unoptimised assets are located)
var src                 = 'src'; // src directory (where various prebuilt assets are located)
var dist                = 'dist'; // distribution directory (where final deployable website is located)

var platform            = 'Joomla'; // which platform this project is built on. (Joomla / Wordpress / Prestashop)
var cssFolderPath       = '/templates/protostar/css/custom/'; // where the css assets are located in the current template
var jsFolderPath        = '/templates/protostar/js/custom/'; // where the js assets are located in the current template
var imagesFolderPath    = '/images/'; // main images folder in development directory
var tplImagesFolderPath = '/templates/protostar/images/'; // images folder path in the current template (used by template css and plugins)

module.exports = {
    browsersync: {
        development: {
            files: [ // list of files to watch
                build + cssFolderPath + '*.css',
                build + jsFolderPath + '*.js',
                build + '/images/**/*.{jpg,jpeg,png,gif,webp}'
            ],
            host: "192.168.1.1", // // Override auto host detection
            notify: {
                styles: { // set notification CSS styles
                    'backgroundColor': '#d11a80',
                    'borderBottomLeftRadius': 0,
                    'fontSize': '13px'
                }
            },
            open: 'local', // Decide which URL to open automatically when Browsersync starts. Can be true, local, external, ui, ui-external, tunnel or false
            port: 8888, // use a specific port, default port used by Browsersync is 3000
            proxy: 'http://192.168.33.10/', // proxy an existing vhost
            // proxy: 'localhost/gulp-tasks/public',
        },
        production: {
            base: dist, // dir to server files from
            ghostMode: false, // Clicks, Scrolls & Form inputs on public url will not be mirrored to all others.
            logFileChanges: false, // Don't log file changes
            open: 'external', // Decide which URL to open automatically when Browsersync starts. Can be true, local, external, ui, ui-external, tunnel or false
            port: 9999, // use a specific port, default port used by Browsersync is 3000
            proxy: 'localhost', // proxy an existing vhost
            tunnel: true // Tunnel the Browsersync server through a random Public URL
        }
    },
    sass: {
        src: src + '/scss/**/*.{sass,scss}', // dir where the scss files reside
        dest: build + cssFolderPath, // dir to output the css file
        options: {
            outputStyle: 'expanded', // CSS output style (nested | expanded | compact | compressed)
            sourceComments: true, // Include debug info in output
            sourceMap: './' // Enable source map
        }
    },
    autoprefixer: {
        browsers: [ // list of supported browsers
            "last 3 versions"
        ],
        cascade: true // use Visual Cascading
    },
    browserify: {
        debug: true, //enable source maps
        extensions: ['.coffee', '.hbs'], //additional file extensions to make optional
        //a separate bundle will be generated for each bundle config below
        bundleConfigs: [
            {
                entries: src + '/js/custom.js',
                dest: build + jsFolderPath,
                outputName: 'custom.js'
            }
        ]
    },
    base64: {
        src: build + cssFolderPath + '*.css', // location of css files to run base64 task on
        dest: build + cssFolderPath, // dir to output the base64 encoded css files
        options: {
            baseDir: build + cssFolderPath, // The path specified in this option will be used as the base directory (relative to gulpfile) for absolute image paths
            extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg'], // Process only specified extensions
            maxImageSize: 20 * 1024, // Maximum filesize in bytes for changing image to base64 (20 * 1024 = 20KB)
            debug: true // Enable log to console
        }
    },
    watch: {
        platformFiles: determineFilesToWatch(platform),
        sass: src + '/scss/**/*.{sass,scss}',
        scripts: src + '/js/**/*.js',
        sprites: src + '/sprites/*.{png,jpg,jpeg}'
    },
    scsslint: {
        src: [
            src + '/scss/**/*.{sass,scss}', // dir where scss files are located
            '!' + src + '/scss/_sprites.scss', //ignore generated sprites 
            '!' + src + '/scss/_sprites-jpg.scss'
        ],
        options: {
            bundleExec: false // If your scss_lint gem is installed via bundler, then set this option to true
        }
    },
    jshint: {
        src: src + '/js/*.js' // dir where js assets are
    },
    sprites: {
        png: {
            src: src + '/sprites/*.png', // where the sprite icons are located
            dest: {
                css: src + '/scss/', // where to output the sprite scss file
                image: build + tplImagesFolderPath // where to output the sprite image file
            },
            options: {
                cssName: '_sprites.scss', // filename to save CSS as
                cssFormat: 'css', //  CSS format to use
                cssOpts: { // options to pass through to templater
                    cssSelector: function(item) {
                        //if this is a hover sprite, name it as a hover one (e.g 'home-hover' -> 'home:hover')
                        if (item.name.indexOf('-hover') !== -1) {
                            return '.icon-' + item.name.replace('-hover', ':hover');
                        } else { //otherwise, use name as selector
                            return '.icon-' + item.name;
                        }
                    }
                },
                imgName: 'icon-sprite.png', // filename to save image as
                imgPath: getRelativePath(build + cssFolderPath, build + tplImagesFolderPath) + '/icon-sprite.png', // path to use in CSS file referring to image location
            }
        },
        jpg: {
            src: src + '/sprites/*.{jpg,jpeg}', // where the sprite icons are located
            dest: {
                css: src + '/scss/', // where to output the sprite scss file
                image: build + tplImagesFolderPath // where to output the sprite image file
            },
            options: {
                cssName: '_sprites-jpg.scss', // filename to save CSS as
                cssFormat: 'css', //  CSS format to use
                cssOpts: { // options to pass through to templater
                    cssSelector: function(item) {
                        //if this is a hover sprite, name it as a hover one (e.g 'home-hover' -> 'home:hover')
                        if (item.name.indexOf('-hover') !== -1) {
                            return '.icon-' + item.name.replace('-hover', ':hover');
                        } else { //otherwise, use name as selector
                            return '.icon-' + item.name;
                        }
                    }
                },
                imgName: 'icon-sprite.jpg', // filename to save image as
                imgPath: getRelativePath(build + cssFolderPath, build + tplImagesFolderPath) + '/icon-sprite.jpg', // path to use in CSS file referring to image location
            }
        }
    },
};

/**
 * Function to compare dynamically two paths in the same domain and get the relative path between them
 * Refer to https://github.com/nodejs/node-v0.x-archive/blob/master/lib/path.js
 * @param  {string} from - from this absolute path
 * @param  {string} to - to this absolute path
 * @return {string} - Relative path between the 2 absolute paths (no trailing slash)
 */
function getRelativePath(from, to) {
    function trim(arr) {
      var start = 0;
      for (; start < arr.length; start++) {
        if (arr[start] !== '') break;
      }

      var end = arr.length - 1;
      for (; end >= 0; end--) {
        if (arr[end] !== '') break;
      }

      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }

    var fromParts = trim(from.split('/'));
    var toParts = trim(to.split('/'));

    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }

    var outputParts = [];
    for (var j = samePartsLength; j < fromParts.length; j++) {
      outputParts.push('..');
    }

    outputParts = outputParts.concat(toParts.slice(samePartsLength));

    return outputParts.join('/');
}

/**
 * Determines which files to watch for browser reload based on the project's platform
 * @param  {string} platform - Platform this project is built on (Joomla / Wordpress / Prestashop)
 * @return {array} - a list of files to watch
 */
function determineFilesToWatch(platform) {
    const PLATFORM_JOOMLA = 'joomla';

    switch(platform.toLowerCase()) {
        case PLATFORM_JOOMLA:
            return [
                build + '/administrator/components/**/*.{php,xml}',
                build + '/administrator/language/overrides/*.ini',
                build + '/administrator/modules/**/*.{php,xml}',
                build + '/components/**/*.{php,xml}',
                build + '/language/overrides/*.ini',
                build + '/modules/**/*.{php,xml}',
                build + '/plugins/**/*.{php,xml}',
                build + '/templates/protostar/**/*.{php,html,xml,json,less}',
            ];

        default:
            return [
                build + '/**/*.{php,html}'
            ];
    }
}