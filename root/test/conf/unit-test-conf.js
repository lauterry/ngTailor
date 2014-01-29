module.exports = function (config) {

    "use strict";

    config.set({

            // base path, that will be used to resolve files and exclude
            basePath: '../../app',


            // frameworks to use
            frameworks: ['jasmine'],


            // list of files / patterns to load in the browser
            files: [
                'vendor/angular/angular.js',
                {% if (modules.i18n) { %}'vendor/angular-i18n/angular-i18n.js',{% } %}
                {% if (modules.indexOf('route') !== -1) { %}'vendor/angular-route/angular-route.js',{% } %}
                {% if (modules.indexOf('resource') !== -1) { %}'vendor/angular-resource/angular-resource.js',{% } %}
                {% if (modules.indexOf('animate') !== -1) { %}'vendor/angular-animate/angular-animate.js',{% } %}
                {% if (modules.indexOf('cookies') !== -1) { %}'vendor/angular-cookies/angular-cookies.js',{% } %}
                {% if (modules.indexOf('sanitize') !== -1) { %}'vendor/angular-sanitize/angular-sanitize.js',{% } %}
                {% if (modules.indexOf('touch') !== -1) { %}'vendor/angular-touch/angular-touch.js',{% } %}
                {% if (thirdModules.indexOf('angular-ui-router') !== -1) { %}'vendor/angular-ui-router/release/angular-ui-router.js',{% } %}
                {% if (thirdModules.indexOf('angular-translate') !== -1) { %}'vendor/angular-translate/angular-translate.js',{% } %}
                {% if (thirdModules.indexOf('revolunet-angular-carousel') !== -1) { %}
                'vendor/angular-touch/angular-touch.js',
                'vendor/revolunet-angular-carousel/dist/angular-carousel.js',
                {% } %}
                {% if (thirdModules.indexOf('angular-snap') !== -1) { %}'vendor/angular-snap/angular-snap.js',{% } %}
                {% if (thirdModules.indexOf('angular-bindonce') !== -1) { %}'vendor/angular-bindonce/bindonce.js',{% } %}
                'vendor/angular-mocks/angular-mocks.js',
                'js/*.js',
                '../test/unit/**/*.js'
            ],

            // list of files to exclude
            exclude: [

            ],


            // test results reporter to use
            // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
            reporters: ['progress', 'coverage'],

            // web server port
            port: 9877,

            // enable / disable colors in the output (reporters and logs)
            colors: true,


            // level of logging
            // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
            logLevel: config.LOG_INFO,


            // enable / disable watching file and executing tests whenever any file changes
            autoWatch: true,


            // Start these browsers, currently available:
            // - Chrome
            // - ChromeCanary
            // - Firefox
            // - Opera (has to be installed with `npm install karma-opera-launcher`)
            // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
            // - PhantomJS
            // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
            browsers: ['Chrome'],


            // If browser does not capture in given timeout [ms], kill it
            captureTimeout: 60000,

            preprocessors: {
                '**/*.html': ['ng-html2js'],
                '**/js/*.js': ['coverage']
            },

            plugins: [
                'karma-jasmine',
                'karma-coverage',
                'karma-ng-html2js-preprocessor',
                'karma-chrome-launcher',
                'karma-firefox-launcher'
            ],


            // Continuous Integration mode
            // if true, it capture browsers, run tests and exit
            singleRun: false
        }
    )
    ;
}
;
