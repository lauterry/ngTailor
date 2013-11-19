module.exports = function(grunt) {

    grunt.initConfig({

        assetsDir: 'app',
        distDir: 'dist',

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
                        'img/**',
                        'partials/**'
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
            js: {
                files: ['<%= assetsDir %>/js/**/*.js'],
                tasks: ['jshint', 'karma:unit:run'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['<%= assetsDir %>/css/**/*.css'],
                tasks: ['csslint']
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            all : {
                src : ['<%= assetsDir %>/css/**/*.css']
            }
        },
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
        }
    });

    // on watch events configure jshint:all to only run on changed file
    grunt.event.on('watch', function(action, filepath) {
        grunt.config('jshint.all.src', filepath);
        grunt.config('csslint.all.src', filepath);
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-rev');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-usemin');

    grunt.registerTask('dev', ['karma:unit:start', 'watch']);
    grunt.registerTask('default', ['jshint', 'clean', 'useminPrepare', 'copy', 'concat', 'ngmin', 'uglify', 'cssmin', 'rev', 'usemin' ]);

};