/*
 * ngTailor
 * Copyright (c) 2013 Thierry LAU
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = 'Scaffold out an AngularJS application, writing your Grunt and Bower configurations with everything you need';

// Template-specific notes to be displayed before question prompts.
exports.notes =
    '° _Fast mode_ : Generate me an angularjs project with the minimal options.'.cyan +
    '\n' +
    '° _Advanced mode_ : Let me customize my scaffolding and add more features.'.cyan +
    '\n\n' +
    'Note that most templates generate their files in the current directory, '.cyan +
    'so be sure to change to a new directory first if you don\'t want to overwrite existing files.'.cyan +
    '\n\n';

// Template-specific notes to be displayed after question prompts.
exports.after = 'Your angular project has been successfully generated.'.green +
    '\nngTailor has prepared some revelant grunt tasks for you.'.green +
    '\nRun "grunt ls" to display them in your console.'.green +
    '\n\nFor more information about ngTailor and its grunt tasks, please see '.blue +
    '\n' +
    'https://github.com/lauterry/ngTailor/blob/master/README.md'.blue;

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {

    var inquirer = require("inquirer");
    var semver = require("semver");
    var path = require('path');
    var _s = require('underscore.string');
    var status = require('cli-status');
        status.configure({
            type : 'ellipsis',
            prefix  : 'In progress',
            autoStepTime : 500
        });
    var exec = require('child_process').exec,
        child;
    var currentWorkingDirectory = process.cwd().split(path.sep).pop();
    var thirdModuleMapping = {
        "angular-ui-router" : "ui.router",
        "angular-translate" : "pascalprecht.translate",
        "revolunet-angular-carousel" : "angular-carousel",
        "angular-snap" : "snap",
        "angular-bindonce" : "pasvaz.bindonce"
    };

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
        i18n : false,
        csspreprocessor : 'none',
        tests : false,
        imagemin : false,
        modules : [],
        thirdModules : []
    };


    function gruntInit(options) {
        var bowerJSON,
            packageJSON,
            files;

        /**************************
         *       COPY FILES       *
         **************************/

        options.title = _s.humanize(options.name);

        files = init.filesToCopy(options);

        if (options.gitignore === false) {
            delete files['.gitignore'];
        }

        if (options.csslint === false) {
            delete files['.csslintrc'];
        }

        if (options.csspreprocessor !== 'sass') {
            delete files['app/scss/app.scss'];
            delete files['app/scss/style.scss'];
        } else {
            delete files['app/css/app.css'];
        }

        if (options.csspreprocessor !== 'less') {
            delete files['app/less/app.less'];
            delete files['app/less/style.less'];
        } else {
            delete files['app/css/app.css'];
        }

        if (options.test === false || options.tests.unit === false) {
            delete files['test'];
            delete files['test/conf/unit-test-conf.js'];
            delete files['test/unit/appSpec.js'];
            delete files['test/.jshintrc'];
        }

        if (options.test === false || options.tests.e2e === false) {
            delete files['test'];
            delete files['test/conf/e2e-test-conf.js'];
            delete files['test/e2e/scenarios.js'];
            delete files['test/.jshintrc'];
        }

        // build the list of angular official modules to declare as your module dependencies
        options.importedModules = "[  ";
        if(options.modules){
            options.modules.map(function(module){
                if (module !== "i18n") {
                    options.importedModules = options.importedModules + "'ng" + _s.capitalize(module) + "', ";
                }
            });

        }

        // build the list of external modules as your module dependencies
        if(options.thirdModules){
            options.thirdModules.map(function(module){
                options.importedModules = options.importedModules + "'" + thirdModuleMapping[module] + "', ";
            });
        }
        options.importedModules = options.importedModules.substring(0, options.importedModules.length - 2) + "]";

        init.copyAndProcess(files, options, {noProcess: '.gitignore'});

        /**************************
         *  GENERATE PACKAGE.JSON *
         **************************/

		packageJSON = grunt.file.readJSON('package.json');
		packageJSON.name = options.name;
		packageJSON.version =  options.version;
		packageJSON.description = options.description;

        if (options.test === true && options.tests.unit === true) {
            packageJSON.devDependencies['grunt-karma'] = "~0.6.2";
            packageJSON.devDependencies['karma-ng-html2js-preprocessor'] = "~0.1.0";
            packageJSON.devDependencies['karma-chrome-launcher'] = "~0.1.0";
            packageJSON.devDependencies['karma-firefox-launcher'] = "~0.1.0";
            packageJSON.devDependencies['karma-jasmine'] = "~0.1.3";
            packageJSON.devDependencies['karma-phantomjs-launcher'] = "~0.1.0";
            packageJSON.devDependencies['karma'] = "~0.10.4";
            packageJSON.devDependencies['karma-coverage'] = "~0.1.4";
        }

        if (options.test === true && options.tests.e2e === true) {
            packageJSON.devDependencies['grunt-karma'] = "~0.6.2";
            packageJSON.devDependencies['karma-ng-scenario'] = "~0.1.0";
            packageJSON.devDependencies['karma'] = "~0.10.4";
        }

        if (options.revision === true) {
            packageJSON.devDependencies['grunt-rev'] = "~0.1.0";
        }

        if (options.csspreprocessor === 'sass') {
            packageJSON.devDependencies['grunt-contrib-sass'] = "~0.6.0";
        }

        if (options.csspreprocessor === 'less') {
            packageJSON.devDependencies['grunt-contrib-less'] = "~0.10.0";
        }

        if (options.csslint === true) {
            packageJSON.devDependencies['grunt-contrib-csslint'] = "~0.2.0";
        }

        if (options.imagemin === true) {
            packageJSON.devDependencies['grunt-contrib-imagemin'] = "~0.4.1";
        }

        if (options.complexity === true) {
            packageJSON.devDependencies['grunt-plato'] = "~0.2.1";
        }

        init.writePackageJSON('package.json', packageJSON);


        /***********************
         * GENERATE BOWER.JSON *
         ***********************/

        bowerJSON = {
            name: options.name,
            version: options.version,
            description: options.description,
            dependencies: {
                "angular": options.angular_version
            },
            "devDependencies": {
            }
        };

        if (options.test === true) {
            bowerJSON.devDependencies['angular-mocks'] = options.angular_version;
        }

        if(options.modules){
            options.modules.map(function(module){
                if (options.modules.indexOf(module) !== -1) {
                    bowerJSON.dependencies['angular-' + module] = options.angular_version;
                }
            });
        }

        if(options.thirdModules){
            options.thirdModules.map(function(module){
                if (options.thirdModules.indexOf(module) !== -1) {
                    bowerJSON.dependencies[module] = "*";
                }
            });
        }

        init.writePackageJSON('bower.json', bowerJSON);

    }

    /**
     * Run npm install, bower install and grunt bower-install
     */
    function installDependencies() {
        console.log('\n');
        status.configure({
            prefix  : '[1/3] Running npm install'.blue
        });
        status.start();

        child = exec('npm install', function (error, stdout, stderr) {

            status.end();

            if (error !== null) {

                console.error(stderr);
                console.error('Failed to run "npm install". \nPlease run "npm install && bower install && grunt bower-install" afterwards.\n'.red);

            } else {

                status.configure({
                    prefix  : '[2/3] Running bower install'.blue
                });
                status.start();

                exec('bower install', function (error, stdout, stderr) {

                    status.end();

                    if (error !== null) {

                        console.error(stderr);
                        console.error('Failed to run "bower install". \nPlease run "bower install && grunt bower-install" afterwards.\n'.red);

                    } else {

                        status.configure({
                            prefix  : '[3/3] Running grunt bower-install'.blue
                        });
                        status.start();

                        exec('grunt bower-install', function (error, stdout, stderr) {

                            status.end();

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

    inquirer.prompt([
        {
            type: "list",
            name: "mode",
            message: "Which mode do you want to run ?",
            choices: ["Fast", "Advanced"]
        }
    ], function (answers) {

        var mode = answers.mode;

        if (mode === "Advanced") {

            inquirer.prompt([
                {
                    type: "input",
                    name: "name",
                    message: "Name your project",
                    default: currentWorkingDirectory
                },
                {
                    type: "input",
                    name: "angular_version",
                    message: "Version of angular (leave blank to fetch the latest version available or specify one)",
                    validate: function (value) {
                        var valid = semver.validRange(value);
                        if (valid === null) {
                            return "Please enter a valid semantic version (semver.org)";
                        } else {
                            return true;
                        }
                    }
                },
                {
                    type: "checkbox",
                    name: "modules",
                    message: "What official angular modules do you need ?",
                    choices: [ "i18n", "route", "resource", "animate", "cookies", "sanitize", "touch" ]
                },
                {
                    type: "checkbox",
                    name: 'thirdModules',
                    message: 'What amazing angular modules do you need ?',
                    choices: [ "angular-ui-router", "angular-translate", "angular-snap", "revolunet-angular-carousel", "angular-bindonce" ]
                },
                {
                    type: "confirm",
                    name: "test",
                    message: "Should I set up tests configuration ?",
                    default: false
                },
                {
                    type: "checkbox",
                    name: "tests",
                    message: "Which tests should I set up ?",
                    choices: [ "unit", "e2e" ],
                    when: function (answers) {
                        return answers.test === true;
                    }
                },
                {
                    type: "confirm",
                    name: "revision",
                    message: "Rename JS & CSS files for browser caching purpose ?  (i.e. app.js becomes 8664d46sf64.app.js)",
                    default: false
                },
                {
                    type: "confirm",
                    name: 'csslint',
                    message: 'Should I lint your CSS with CSSLint',
                    default: false
                },
                {
                    type: "list",
                    name: 'csspreprocessor',
                    message: 'Should I set up one of those CSS preprocessors ?',
                    choices: [ "none", "sass", "less" ],
                    default: 0
                },
                {
                    type: "confirm",
                    name: "imagemin",
                    message: "Should I optimize your images (gif, png, jpeg) ?",
                    default: false
                },
                {
                    type: "confirm",
                    name: 'complexity',
                    message: 'Should I generate a complexity report for your project ?',
                    default: false
                }
            ], function (answers) {

                for (var attr in answers) {
                    if (answers.hasOwnProperty(attr)) {
                        options[attr] = answers[attr];
                    }
                }

                if (options.tests) {
                    options.tests.e2e = options.tests.indexOf('e2e') !== -1;
                    options.tests.unit = options.tests.indexOf('unit') !== -1;
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
