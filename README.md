# Modular Gulp Kit
A modular set of gulp tasks that I made for my Wordpress / Joomla / Prestashop projects. Feel free to fork and modify it to your own tastes. Based on the excellent [Gulp tutorials](http://stefanimhoff.de/2014/gulp-tutorial-1-intro-setup/) by Stefan Imhoff.

# Configuration
Directory and top level settings are exposed in gulp/config.js. Use this file to update paths to match the directory structure of your project, and to adjust task options.

Credentials for deployment tasks are set in gulp/credentials.js. Set the right ftp credentials, and you should be able to deploy your website via gulp.

Not all configuration is exposed here. For advanced task configuration, you can always edit the tasks themselves in gulp/tasks.

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