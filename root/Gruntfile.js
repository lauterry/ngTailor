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
                tasks: ['jshint', 'karma:unit:run']
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
                    keepalive: true,
                    livereload: true,
                    open: true
                }
            }
        }
    });

    // on watch events configure jshint:all to only run on changed file
    grunt.event.on('watch', function(action, filepath) {
        grunt.config('jshint.all.src', filepath);
        grunt.config('csslint.all.src', filepath);
    });

    grunt.registerTask('default', ['jshint', 'clean', 'useminPrepare', 'copy', 'concat', 'ngmin', 'uglify', 'cssmin', {% if(revision){%}'rev', {%}%} 'usemin' ]);

};