module.exports = function(grunt) {

    "use strict";

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        assetsDir: 'app',
        distDir: 'dist',

        'bower-install': {
            target: {
                src: '<%= assetsDir %>/index.html',
                ignorePath: '<%= assetsDir %>/',
                jsPattern: '<script type="text/javascript" src="{{filePath}}"></script>',
                cssPattern: '<link rel="stylesheet" href="{{filePath}}" >'
            }
        },
        clean: {
            dist: ['.tmp', '<%= distDir %>']
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= assetsDir %>',
                    dest: '<%= distDir %>/',
                    src: [
                        'index.html',
                        'img/**'
                    ]
                }]
            }
        },
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/js',
                    src: '*.js',
                    dest: '.tmp/concat/js'
                }]
            }
        },
        useminPrepare: {
            html: '<%= assetsDir %>/index.html',
            options: {
                dest: '<%= distDir %>'
            }
        },
        usemin: {
            html: '<%= distDir %>/index.html'
        },
        browser_sync: {
            dev: {
                bsFiles: {
                    src : ['<%= assetsDir %>/**/*.html', '<%= assetsDir %>/**/*.js', '<%= assetsDir %>/**/*.css']
                },
                options: {
                    watchTask: true,
                    ghostMode: {
                        clicks: true,
                        scroll: true,
                        links: false, // must be false to avoid interfering with angular routing
                        forms: true
                    },
                    server: {
                        baseDir: "<%= assetsDir %>"
                    }
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all : {
                src : ['<%= assetsDir %>/js/**/*.js']
            }
        }{% if (revision) { %},
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= distDir %>/js/{,*/}*.js',
                        '<%= distDir %>/css/{,*/}*.css'
                    ]
                }
            }
        }{% } %},
        watch: {
            options : {
                interrupt: true
            },
            js: {
                files: ['<%= assetsDir %>/js/**/*.js'],
                tasks: ['newer:jshint' {% if (test) { %}, 'karma:dev_unit:run' {% } %}]
            },
            html : {
                files: ['<%= assetsDir %>/**/*.html']
            },
            css: {
                files: ['<%= assetsDir %>/css/**/*.css']{% if (csslint) { %},
                tasks: ['csslint']
                {% } %}
            }{% if (csspreprocessor === 'sass') { %},
            scss: {
                files : ['<%= assetsDir %>/scss/**/*.scss'],
                tasks: ['sass:all']
            }{% } %}
        }{% if (csslint) { %},
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            all : {
                src : ['<%= assetsDir %>/css/**/*.css']
            }
        }{% } %},
        connect: {
            test : {
                options: {
                    port: 8887,
                        base: '<%= assetsDir %>',
                        keepalive: false,
                        livereload: false,
                        open: false
                }
            }{% if (complexity) { %},
            plato : {
                options: {
                    port: 8889,
                        base: 'reports/complexity',
                        keepalive: true,
                        open: true
                }
            }{% } %}
        }{% if (test) { %},
        karma: {
            {% if (tests.unit) { %}dev_unit: {
                options: {
                    configFile: 'test/conf/unit-test-conf.js',
                        background: true,  // The background option will tell grunt to run karma in a child process so it doesn't block subsequent grunt tasks.
                        singleRun: false,
                        autoWatch: true,
                        reporters: ['progress']
                }
            },
            dist_unit: {
                options: {
                    configFile: 'test/conf/unit-test-conf.js',
                        background: false,
                        singleRun: true,
                        autoWatch: false,
                        reporters: ['progress', 'coverage'],
                        coverageReporter : {
                            type : 'html',
                            dir : '../reports/coverage'
                        }
                }
            },{% } %}
            {% if (tests.e2e) { %}e2e: {
                options: {
                    configFile: 'test/conf/e2e-test-conf.js'
                }
            }{% } %}
        }{% } %}{% if (complexity) { %},
        plato : {
            options: {
                jshint : grunt.file.readJSON('.jshintrc'),
                    title : '{%= title %}'
            },
            all : {
                files: {
                    'reports/complexity': ['<%= assetsDir %>/js/**/*.js']
                }
            }
        }{% } %}{% if (csspreprocessor === 'sass') { %},
        sass: {
            options : {
                style : 'expanded',
                trace : true
            },
            all: {
                files: {
                    '<%= assetsDir %>/css/app.css': '<%= assetsDir %>/scss/app.scss'
                }
            }
        }{% } %}{% if (imagemin === true) { %},
        imagemin : {
            dist : {
                options : {
                    optimizationLevel: 7,
                    progressive : false,
                    interlaced : true
                },
                files: [{
                    expand: true,
                    cwd: '<%= assetsDir %>/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%= distDir %>/'
                }]
            }
        }{% } %}
    });

    {% if (tests.e2e) { %}grunt.registerTask('test:e2e', ['connect:test', 'karma:e2e']);{% } %}
    {% if (tests.unit) { %}grunt.registerTask('test:unit', ['karma:dist_unit:start']);{% } %}
    {% if (complexity) { %}grunt.registerTask('report', ['plato', 'connect:plato']);{% } %}
    grunt.registerTask('dev', [{% if (csspreprocessor === 'sass') { %}'sass',{% } %}'browser_sync', {% if (tests.unit) { %}  'karma:dev_unit:start',  {% } %} 'watch']);
    grunt.registerTask('package', ['jshint', 'clean', 'useminPrepare', 'copy', 'concat', 'ngmin', 'uglify', {% if (csspreprocessor === 'sass') { %}'sass',{% } %} 'cssmin', {% if (revision) { %} 'rev',{% } %} {% if (imagemin === true) { %}'imagemin',{% } %} 'usemin']);
    grunt.registerTask('default', ['package'{%if(tests.unit || tests.e2e){%}, 'connect:test',{% } %} {%if(tests.unit){%}'karma:dist_unit:start',{% } %} {%if(tests.e2e){%} 'karma:e2e'{% } %} {% if (complexity) { %} ,'plato'{% } %}]);


};