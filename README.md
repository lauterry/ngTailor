ngTailor [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
==================

Scaffold an Angular project with Grunt and Bower configurations fitted to your needs.

<img height="250" align="left" src="http://bower.io/img/bower-logo.png">

<img height="250" align="left" src="https://s3.amazonaws.com/media-p.slid.es/uploads/hugojosefson/images/86267/angularjs-logo.png">

<img height="250" align="left" src="http://gruntjs.com/img/grunt-logo.svg">

## Why is ngTailor interesting ?
* Interactive way to scaffold your angular project to fit your needs. 
  Need angular-i18n locales ? Want angular version 1.2.1 ? You need to lint your CSS ? Just answer a few questions prompted to you.
* Your assets dependencies are managed by [bower](http://www.bower.io)
* Automatically run [ng-min](https://github.com/btford/ngmin) before your minification process
* Do not handle manually one index.html for development and one index.html for production thanks to [grunt-usemin](https://github.com/yeoman/grunt-usemin).
  Automatically replace your scripts and stylesheets declaration with the minified version when packaging your app for production.
* Watch for you assets changes and automatically run `jshint` or `csslint` on your code and even unit tests.
* Livereload is out of the box. No F5 anymore
* Automatically output a hash in your assets file name for caching purpose.
* Set up tests to be run with Karma with Jasmine and generate test coverage report.
* Automatically run `npm install && bower install && grunt bower-install` to download your projet dependencies

## Prerequisites
1. Install [node and npm](http://www.nodejs.org)
2. Install **Grunt** running `npm install -g grunt-cli` 
3. Install **Bower** running `npm install -g bower`
4. Install **grunt-init** running `npm install -g grunt-init`
5. Install this template in your `~/.grunt-init/` directory (`%USERPROFILE%\.grunt-init\` on Windows) 
   by running `git clone https://github.com/lauterry/ngTailor.git ~/.grunt-init/angular`

## Generate your Angular project
1. Create a new folder for your project
2. Open a terminal and run `grunt-init angular` in your project folder
3. Answer the questions prompted to you to scaffold your project to your needs
4. Run `grunt dev` to serve your static assets at [http://localhost:8888](http://localhost:8888)
5. Your should see "Yeahhh ! You're ready !" displayed in your browser
6. Voilà ! Your Angular project is ready !

## Developement
* Run `grunt dev` to start a static web server and open your browser at [http://localhost:8888](http://localhost:8888).
* Livereload will be automatically active meaning that you can see your modification on the browser without hitting F5.
* `jshint` and/or `csslint` will be run on your files when they change.
* If you choose to have unit tests, they will be run as your test and source files change.

## Package for Production
* Run `grunt package` to package your static assets for production.
* Your package will be generated in a `dist` folder and your javascripts and stylesheets will be concatenated, minified and versionned.
* `grunt` : launch `grunt package`, run unit tests and e2e test and generate complexity report. Use this task for continuous integration.

## Available Grunt tasks
* `grunt test:unit` : run karma unit tests and show test coverage in console.
* `grunt test:e2e` : run karma e2e tests
* `grunt report` : open complexity report in your browser
