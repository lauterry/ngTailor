/*
 * grunt-init-angular
 *
 * Copyright (c) 2013 Thierry LAU
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = 'Scaffold out an AngularJS application, writing your Grunt and Bower configurations will all you choose that you need';

// Template-specific notes to be displayed before question prompts.
exports.notes = 'Note that most templates generate their files in the current directory, so be sure to change to a new directory first if you don\'t want to overwrite existing files.'.cyan;

// Template-specific notes to be displayed after question prompts.
exports.after = 'You should now install project dependencies with _npm '.cyan +
    'install_ then _bower install_ and _grunt bower-install_. After that, you may execute project tasks with _grunt_. For '.cyan +
    'more information about grunt-init-angular, please see '.cyan +
    'the Getting Started guide:'.cyan +
    '\n\n' +
    'https://github.com/lauterry/grunt-init-angular/blob/master/README.md'.cyan;

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {

    var path = require('path');
    var _s = require('underscore.string');
    var currentWorkingDirectory = process.cwd().split(path.sep).pop();

    init.process({}, [
        init.prompt('name', currentWorkingDirectory),
        init.prompt('title', _s.humanize(currentWorkingDirectory)),
        init.prompt('version', '0.0.1'),
        init.prompt('description', 'The best angular app ever !'),
        {
            name : 'angular_version',
            message : 'Which version of angular do you want to use ?'.blue,
            default : '1.2.0',
            warning : 'Must be a valid semantic version (semver.org)'
        },
        {
            name : 'i18n',
            message : 'Need angular-i18n locales ?'.blue,
            default : 'y/N'
        },
        {
            name : 'gitignore',
            message : 'Add .gitignore ?'.blue,
            default : 'y/N'
        },
        {
            name : 'csslint',
            message : 'Lint your CSS ?'.blue,
            default : 'y/N'
        },
        {
            name : 'revision',
            message : 'Add revision hash in your assets name for caching purpose ?  app.js becomes 8664d46sf64.app.js'.blue,
            default : 'y/N'
        },
        {
            name : 'test',
            message : 'Settle tests with Karma and Jasmine ?'.blue,
            default : 'y/N'
        }
    ], function(err, props) {

        var bowerContent,
            packageContent,
            files = init.filesToCopy(props);

        /***************************
         * PROCESS AND COPY FILES  *
         ***************************/

        if(/n/i.test(props.gitignore)){
            delete files['.gitignore'];
        }

        props['csslint'] = !/n/i.test(props.csslint);

        props['test'] = !/n/i.test(props.test);

        props['revision'] = !/n/i.test(props.revision);

        init.copyAndProcess(files, props, {noProcess: '.gitignore'});

        /**************************
         *  GENERATE PACKAGE.JSON *
         **************************/

        packageContent = {
            name: props.name,
            version: props.version,
            description: props.description,
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
                "grunt-bower-install": "~0.6.1"
            }
        };

        if(props['test']){
            packageContent.devDependencies['grunt-karma'] = "~0.6.2";
            packageContent.devDependencies['karma-ng-html2js-preprocessor'] = "~0.1.0";
            packageContent.devDependencies['karma-ng-scenario'] = "~0.1.0";
            packageContent.devDependencies['karma-chrome-launcher'] = "~0.1.0";
            packageContent.devDependencies['karma-firefox-launcher'] = "~0.1.0";
            packageContent.devDependencies['karma-jasmine'] = "~0.1.3";
            packageContent.devDependencies['karma-phantomjs-launcher'] = "~0.1.0";
            packageContent.devDependencies['karma'] = "~0.10.4";
        }

        if(props['revision']){
            packageContent.devDependencies['grunt-rev'] = "~0.1.0";
        }

        if(props['csslint']){
            packageContent.devDependencies['grunt-contrib-csslint'] = "~0.2.0";
        }

        init.writePackageJSON('package.json', packageContent);


        /***********************
         * GENERATE BOWER.JSON *
         ***********************/

        bowerContent =  {
            name: props.name,
            version: props.version,
            description: props.description,
            dependencies: {
                "angular": "~" + props.angular_version,
                "angular-route": "~" + props.angular_version
            },
            "devDependencies" : {
                "angular-mocks": "~" + props.angular_version
            }
        };

        if(!/n/i.test(props.i18n)){
            bowerContent.dependencies['angular-i18n'] = "~" + props.angular_version;
        }

        init.writePackageJSON('bower.json', bowerContent);

        done();
    });

};
