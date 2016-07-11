# Modular Gulp Kit
A modular set of gulp tasks that I made for my Wordpress / Joomla / Prestashop projects at my agency. Feel free to fork and modify it to your own tastes. Based on the excellent [Gulp tutorials](http://stefanimhoff.de/2014/gulp-tutorial-1-intro-setup/) by Stefan Imhoff.

# Project Structure (Default)
With the default configuration settings, this gulp kit assumes the project directory structure is as follows:
```
├── gulp               # Folder containing all the gulp tasks
│   ├── config.js      # Tasks configuration
│   ├── credentials.js # Credentials used to deploy project via Gulp
│   ├── tasks
│   │   ├── default.js
│   │   ├── deploy.js
│   │   ├── deployment
│   │   │   ├── db-export.js
│   │   │   ├── ftp.js
│   │   │   └── zip.js
│   │   ├── development
│   │   │   ├── browser-sync.js
│   │   │   ├── build.js
│   │   │   ├── concat-js.js
│   │   │   ├── jshint.js
│   │   │   ├── rebuild.js
│   │   │   ├── sass.js
│   │   │   ├── scripts.js
│   │   │   ├── scss-lint.js
│   │   │   ├── sprites.js
│   │   │   └── watch.js
│   │   ├── production
│   │   │   ├── base64.js
│   │   │   ├── browser-sync.js
│   │   │   ├── build.js
│   │   │   ├── favicon.js
│   │   │   ├── optimise-css.js
│   │   │   ├── optimise-images.js
│   │   │   └── optimise-js.js
│   │   ├── publish.js
│   │   └── sync
│   │       └── db-import.js
│   └── util
│       ├── bundleLogger.js
│       ├── handleErrors.js
│       └── notification.js
├── gulpfile.js
├── package.json
├── public             # This is where your Wordpress / Joomla / Prestashop project files will reside in
└── src
    ├── favicon        # favicon files
            │   ├── favicon.html
            │   ├── favicon.png
            │   └── faviconData.json
    ├── js             # js files
    ├── sass           # .scss files
    └── sprites        # images used for css sprites
```

# Configuration
Directory and top level settings are exposed in gulp/config.js. Use this file to update paths to match the directory structure of your project, and to adjust task options. Refer to example config files in examples folder.

Credentials for deployment tasks are set in gulp/credentials.js. Set the right ftp credentials, and you should be able to deploy your website via gulp. To be able to export the local development database as a sql dump via Gulp, set the local database credentials. Remove the ssh credentials if you are not developing with a VM like Vagrant.

Not all configuration is exposed via the config file. For advanced task configuration, you can always edit the tasks themselves in gulp/tasks.

# Usage
Make sure Node is installed and run the following:
```bash
git clone https://github.com/jasonheecs/gulp-tasks.git MyApp
cd MyApp
npm install
```
## gulp
The `gulp` command runs the build process for developing a website. The build process consists of the following tasks:
### browsersync
Spins up a [Browsersync](https://www.browsersync.io/) server to watch for changes and automatically reloads the server.
### build
Runs a series of tasks for a development build
### jshint
Uses [js-hint](http://jshint.com/) to check the syntax of .js files
### sass
Generates .css from .scss files
### scripts
Bundles the javascript files via [Browserify](http://browserify.org/)
### scss-lint
Lint scss files for writing clean and consistent SCSS
### sprites
Generates CSS sprites (stylesheets and images)
### watch
Watch for file changes and inject them / reload the browser.

## gulp publish
The `gulp publish` command is for optimising the site for deployment and consists of the following tasks:
### base64
Convert small background images used in css files into base64-encoded data URI strings
### browsersync:production
Spins up a Browsersync server for the optimised build of the website
### build:production
Run all tasks need for a production / optimisation build:production
### favicon
Generates favicons for multiple platforms via [Real Favicon Generator](http://realfavicongenerator.net/). The HTML to display the favicons is output in `src/favicon.html` (configurable). 
### optimise:css
Minify and optimise css file(s)
### optimise:images
Optimise image file sizes
### optimise:js
Minify and optimise JS files

## gulp deploy
The `gulp deploy` command is meant for quick deployment of the website via the command line. It consists of the following tasks:
### db:export
Exports the website's database as a sql dump
### ftp
Uploads the website either as a .zip file or as stream of individual files. FTP credentials should be set in credentials.js
### zip
Generates a .zip package of the website directory.