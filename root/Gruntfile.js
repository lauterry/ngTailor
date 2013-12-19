module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        assetsDir: 'app',
        distDir: 'dist',

        'bower-install': {
            target: {
                html: '<%= assetsDir %>/index.html',
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
            html: '<%= assetsDir %>/index.html'
        },
        usemin: {
            html: '<%= distDir %>/index.html'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all : {
                src : ['<%= assetsDir %>/js']
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= distDir %>/js/{,*/}*.js',
                        '<%= distDir %>/css/{,*/}*.css'
                    ]
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            js: {
                files: ['<%= assetsDir %>/js/**/*.js'],
                tasks: ['jshint' {% if (test) { %}, 'karma:unit:run' {% } %}]
            },
            html : {
                files: ['<%= assetsDir %>/**/*.html']
            },
            css: {
                files: ['<%= assetsDir %>/css/**/*.css']{% if (csslint) { %},
                tasks: ['csslint']
                {% } %}
            }
        }, {% if (csslint) { %}
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            all : {
                src : ['<%= assetsDir %>/css/**/*.css']
            }
        }, {% } %}
        connect: {
            server: {
                options: {
                    port: 8888,
                    base: '<%= assetsDir %>',
                    keepalive: false,
                    livereload: true,
                    open: true
                }
            }
        }, {% if (test) { %}
        karma: {
            unit: {
                options: {
                    configFile: 'test/conf/unit-test-conf.js',
                        background: true  // The background option will tell grunt to run karma in a child process so it doesn't block subsequent grunt tasks.
                }
            },
            e2e: {
                options: {
                    configFile: 'test/conf/e2e-test-conf.js'
                }
            }
        }, {% } %}
        {% if (complexity) { %}
        plato : {
            options: {
                jshint : grunt.file.readJSON('.jshintrc'),
                    title : '{%= title %}'
            },
            all : {
                files: {
                    'reports': ['<%= assetsDir %>/js/**/*.js']
                }
            }
        }
        {% } %}
    });

    // on watch events configure jshint:all to only run on changed file
    grunt.event.on('watch', function(action, filepath) {
        grunt.config('jshint.all.src', filepath);
        grunt.config('csslint.all.src', filepath);
    });

    grunt.registerTask('server', ['connect', {% if (test) { %} 'karma:unit:start', {% } %} 'watch']);
    {% if (complexity) { %}grunt.registerTask('report', ['plato']);{% } %}
    grunt.registerTask('default', ['jshint', 'clean', 'useminPrepare', 'copy', 'concat', 'ngmin', 'uglify', 'cssmin', {% if(revision){%}'rev', {%}%} 'usemin' ]);

};