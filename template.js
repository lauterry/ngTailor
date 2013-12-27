/*
 * grunt-init-angular
 *
 * Copyright (c) 2013 Thierry LAU
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = 'Scaffold out an AngularJS application, writing your Grunt and Bower configurations with everything you need';

// Template-specific notes to be displayed before question prompts.
exports.notes =
    '° _Normal mode_ : Generate me an angularjs project with the minimal options.'.cyan +
    '\n' +
    '° _Advanced mode_ : Let me customize my scaffolding and add more features.'.cyan +
    '\n\n' +
    'Note that most templates generate their files in the current directory, '.cyan +
    'so be sure to change to a new directory first if you don\'t want to overwrite existing files.'.cyan +
    '\n\n';

// Template-specific notes to be displayed after question prompts.
exports.after = 'Your angular project has been successfully generated.'.green +
    '\nFor more information about ngTailor and its grunt tasks, please see '.green +
    '\n\n' +
    'https://github.com/lauterry/ngTailor/blob/master/README.md'.green +
    '\n\nAvailable grunt tasks are :'.cyan +
    '\n' +
    '° _grunt dev_ : start a static server'.cyan +
    '\n' +
    '° _grunt package_ : package your web app for distribution'.cyan;

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '';

// The actual init template.
exports.template = function(grunt, init, done) {

    var inquirer = require("inquirer");
    var semver = require("semver");
    var path = require('path');
    var _s = require('underscore.string');
    var exec = require('child_process').exec,
        child;
    var currentWorkingDirectory = process.cwd().split(path.sep).pop();

    var options = {
        name : currentWorkingDirectory,
        angular_version : '*',
        version : '0.0.1',
        description : '',
        csslint : false,
        complexity : false,
        test : false,
        revision : false,
        gitignore : false,
        i18n : false
    };


    function gruntInit(options) {
        var bowerContent,
            packageContent,
            files;

        /**************************
         *       COPY FILES       *
         **************************/

        options.title = _s.humanize(options.name);

        files = init.filesToCopy(options);

        if (!options.gitignore === true) {
            delete files['.gitignore'];
        }

        if (options.csslint === false) {
            delete files['.csslintrc'];
        }

        if (!options.test === true) {
            delete files['test'];
            delete files['test/conf/e2e-test-conf.js'];
            delete files['test/conf/unit-test-conf.js'];
            delete files['test/e2e/scenarios.js'];
            delete files['test/unit/appSpec.js'];
            delete files['test/.jshintrc'];
        }

        init.copyAndProcess(files, options, {noProcess: '.gitignore'});

        /**************************
         *  GENERATE PACKAGE.JSON *
         **************************/

        packageContent = {
            name: options.name,
            version: options.version,
            description: options.description,
            devDependencies: {
                "grunt-usemin": "~2.0.0",
                "grunt-ngmin": "0.0.3",
                "grunt-contrib-clean": "~0.5.0",
                "grunt-contrib-concat": "~0.3.0",
                "grunt-contrib-uglify": "~0.2.7",
                "grunt-contrib-cssmin": "~0.7.0",
                "grunt-contrib-watch": "~0.5.3",
                "grunt-bower-task": "~0.3.4",
                "grunt-contrib-copy": "~0.4.1",
                "grunt-contrib-jshint": "~0.7.2",
                "grunt-contrib-connect": "~0.5.0",
                "load-grunt-tasks": "~0.2.0",
                "grunt-bower-install": "~0.6.1",
                "grunt-newer": "~0.6.0"
            }
        };

        if (options.test === true) {
            packageContent.devDependencies['grunt-karma'] = "~0.6.2";
            packageContent.devDependencies['karma-ng-html2js-preprocessor'] = "~0.1.0";
            packageContent.devDependencies['karma-ng-scenario'] = "~0.1.0";
            packageContent.devDependencies['karma-chrome-launcher'] = "~0.1.0";
            packageContent.devDependencies['karma-firefox-launcher'] = "~0.1.0";
            packageContent.devDependencies['karma-jasmine'] = "~0.1.3";
            packageContent.devDependencies['karma-phantomjs-launcher'] = "~0.1.0";
            packageContent.devDependencies['karma'] = "~0.10.4";
            packageContent.devDependencies['karma-coverage'] = "~0.1.4";

            exports.after = exports.after +
                '\n' +
                '° _grunt test:unit_ : run unit tests and show coverage report'.cyan +
                '\n' +
                '° _grunt test:e2e_ : run end-to-end tests'.cyan;
        }

        if (options.revision === true) {
            packageContent.devDependencies['grunt-rev'] = "~0.1.0";
        }

        if (options.csspreprocessor === 'sass') {
            packageContent.devDependencies['grunt-contrib-sass'] = "~0.6.0";
        }

        if (options.csslint === true) {
            packageContent.devDependencies['grunt-contrib-csslint'] = "~0.2.0";
        }

        if (options.complexity === true) {
            packageContent.devDependencies['grunt-plato'] = "~0.2.1";

            exports.after = exports.after +
                '\n' +
                '° _grunt report_ : display a complexity report in your browser'.cyan;
        }

        init.writePackageJSON('package.json', packageContent);


        /***********************
         * GENERATE BOWER.JSON *
         ***********************/

        bowerContent = {
            name: options.name,
            version: options.version,
            description: options.description,
            dependencies: {
                "angular": options.angular_version,
                "angular-route": options.angular_version
            },
            "devDependencies": {
                "angular-mocks": options.angular_version
            }
        };

        if (options.modules.i18n) {
            bowerContent.dependencies['angular-i18n'] = options.angular_version;
        }

        if (options.modules.route) {
            bowerContent.dependencies['angular-route'] = options.angular_version;
        }


        if (options.modules.resource) {
            bowerContent.dependencies['angular-resource'] = options.angular_version;
        }


        if (options.modules.animate) {
            bowerContent.dependencies['angular-animate'] = options.angular_version;
        }


        if (options.modules.cookies) {
            bowerContent.dependencies['angular-cookies'] = options.angular_version;
        }


        if (options.modules.sanitize) {
            bowerContent.dependencies['angular-sanitize'] = options.angular_version;
        }


        if (options.modules.touch) {
            bowerContent.dependencies['angular-touch'] = options.angular_version;
        }

        init.writePackageJSON('bower.json', bowerContent);

    }

    /**
     * Run npm install, bower install and grunt bower-install
     */
    function installDependencies() {
        console.log('\n[1/3] Running npm install ...'.blue);

        child = exec('npm install', function (error, stdout, stderr) {

            if (error !== null) {

                console.error(stderr);
                console.error('Failed to run "npm install". \nPlease run "npm install && bower install && grunt bower-install" afterwards.\n'.red);

            } else {

                console.log('\n[2/3] Running bower install ...'.blue);
                exec('bower install', function (error, stdout, stderr) {

                    if (error !== null) {

                        console.error(stderr);
                        console.error('Failed to run "bower install". \nPlease run "bower install && grunt bower-install" afterwards.\n'.red);

                    } else {

                        console.log('\n[3/3] Running grunt bower-install ...'.blue);

                        exec('grunt bower-install', function (error, stdout, stderr) {

                            if (error !== null) {

                                console.error(stderr);
                                console.error('Failed to run "grunt bower-install". \nPlease run "grunt bower-install" afterwards.\n'.red);

                            } else {
                                done();
                            }
                        });
                    }
                });
            }
        });
    }

    inquirer.prompt([{
        type: "list",
        name: "mode",
        message: "Which mode do you want to run ?",
        choices: ["Normal", "Advanced"]
    }], function( answers ) {

        var mode = answers.mode;

        if(mode === "Advanced"){
            inquirer.prompt([{
                type: "input",
                name: "name",
                message: "Name your project",
                default: currentWorkingDirectory
            }, {
                type: "input",
                name: "angular_version",
                message: "Version of angular",
                validate: function( value ) {
                    var valid = semver.validRange(value);
                    if(valid === null){
                        return "Please enter a valid semantic version (semver.org)";
                    } else {
                        return true;
                    }
                }
            },{
                type: "checkbox",
                name: "modules",
                message: "What angular module do you need ?",
                choices: [ "i18n", "route", "resource", "animate", "cookies", "sanitize", "touch" ]
            }, {
                type: "confirm",
                name: "test",
                message: "Should I set up tests configuration ?",
                default : false
            }, {
                type: "checkbox",
                name: "tests",
                message: "Which tests should I set up ?",
                choices: [ "unit", "e2e" ],
                when: function( answers ) {
                    return answers.test === true;
                }
            }, {
                type: "confirm",
                name: "revision",
                message: "Rename JS & CSS files for browser caching purpose ?  (i.e. app.js becomes 8664d46sf64.app.js)",
                default : false
            }, {
                type: "confirm",
                name : 'csslint',
                message : 'Should I lint your CSS with CSSLint',
                default : false
            }, {
                type: "list",
                name : 'csspreprocessor',
                message : 'Should I set up one of those CSS preprocessors ?',
                choices: [ "none", "sass" ],
                default : 0
            }, {
                type: "confirm",
                name : 'complexity',
                message : 'Should I generate a complexity report for your project ?',
                default : false
            }], function( answers ) {

                for (var attr in answers) {
                    if (answers.hasOwnProperty(attr)) {
                        options[attr] = answers[attr];
                    }
                }

                gruntInit(options);

                installDependencies();

            });
        } else {

            gruntInit(options);

            installDependencies();
        }

    });
};
