/*
 * grunt-init-angular
 *
 * Copyright (c) 2013 Thierry LAU
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = 'Create an AngularJS project, including tests, with Grunt and Bower';

// Template-specific notes to be displayed before question prompts.
exports.notes = 'Note that most templates generate their files in the current directory, so be sure to change to a new directory first if you don\'t want to overwrite existing files.'.cyan;

// Template-specific notes to be displayed after question prompts.
exports.after = 'You should now install project dependencies with _npm '.cyan +
    'install_ and _bower install_. After that, you may execute project tasks with _grunt_. For '.cyan +
    'more information about installing and configuring Grunt, please see '.cyan +
    'the Getting Started guide:'.cyan +
    '\n\n' +
    'http://gruntjs.com/getting-started'.cyan

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '';

// The actual init template.
exports.template = function(grunt, init, done) {

    init.process({}, [
        init.prompt('name', 'MyAngularApp'),
        init.prompt('title', 'My Angular App'),
        init.prompt('version', '0.0.1'),
        init.prompt('description', 'The best angular web app ever'),
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
        }


    ], function(err, props) {

        var bowerDevDependencies,
            npmDevDependencies,
            files = init.filesToCopy(props);

        if(/n/i.test(props.gitignore)){
            delete files['.gitignore'];
        }

        init.copyAndProcess(files, props, {noProcess: '.gitignore'});

        npmDevDependencies = {
            "grunt-usemin": "~2.0.0",
            "grunt-ngmin": "0.0.3",
            "grunt-contrib-clean": "~0.5.0",
            "grunt-contrib-concat": "~0.3.0",
            "grunt-contrib-uglify": "~0.2.7",
            "grunt-contrib-copy": "~0.4.1",
            "grunt-contrib-jshint": "~0.7.2",
            "grunt-rev": "~0.1.0"
        };

        grunt.log.writeln(JSON.stringify(props));

        init.writePackageJSON('package.json', {
            name: props.name,
            version: props.version,
            description: props.description,
            devDependencies: npmDevDependencies
        });

        bowerDevDependencies =  {
            "angular": "~" + props.angular_version,
            "angular-route": "~" + props.angular_version
        };

        if(!/n/i.test(props.i18n)){
            bowerDevDependencies.devDependencies['angular-i18n'] = "~" + props.angular_version;
        }

        init.writePackageJSON('bower.json', {
            name: props.name,
            version: props.version,
            description: props.description,
            devDependencies: bowerDevDependencies
        });

        done();
    });

};
