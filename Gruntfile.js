/**
 *  Ludum Dare 32 Game
 *  By Jimmy Aupperlee
 *
 *  GruntFile used to automate build tasks and compile 
 *  ---------------------------------------------------
 *  @package    ld32
 *  @author     Jimmy Aupperlee <j.aup.gt@gmail.com>
 *  @license    GPLv3
 *  @version    0.0.1
 *  @since      File available since Release 0.0.1
 */

'use strict';

// The webserver port used by livereload and the webserver
var webserver_port = 1337;

// General method used to check the security of the command
var securityMeasures = function(grunt) {

    if(process.env.USER === "root") {
        grunt.fail.fatal("Grunt got scared, don't execute it as root user!");
        return false;
    }
    return true;
};

module.exports = function(grunt) {

    // Config initialisation
    var grunt_config = {};

    // Insert the config
    grunt.initConfig(grunt_config);

    /**
     * -----------------------------------------------------
     *  Insert the Package json configs
     * -----------------------------------------------------
     */

    grunt_config["pkg"] = grunt.file.readJSON('package.json');

    /**
     * -----------------------------------------------------
     *  Clean the folders if required
     * -----------------------------------------------------
     */
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt_config["clean"] = ["dist"];

    /**
     * -----------------------------------------------------
     *  Code Quality FTW
     * -----------------------------------------------------
     */
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt_config["jshint"] = {
        files: ['Gruntfile.js', 'src/**/*.js'],
        options: {
            jshintrc : true
        }
    };

    /**
     * -----------------------------------------------------
     *  Browserify, because it's awesome!
     * -----------------------------------------------------
     */
    grunt.loadNpmTasks('grunt-browserify');
    grunt_config["browserify"] = {
        build: {
            files: {
                'dist/game.min.js': ['src/game/**/*.js']
            }
        }
    };

    /**
     * -----------------------------------------------------
     *  Copy the needed files
     * -----------------------------------------------------
     */
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt_config["copy"] = {
        build: {
            files: [
                {
                    expand: true,
                    flatten: true,
                    src: ['node_modules/phaser/dist/phaser.min.js'],
                    dest: 'dist/lib',
                    filter: 'isFile'
                },
                {
                    expand: true,
                    flatten: true,
                    src: ['node_modules/phaser/dist/phaser.map'],
                    dest: 'dist/lib',
                    filter: 'isFile'
                },
                {
                    expand: true,
                    cwd: "src/resources",
                    src: ['**/*'],
                    dest: 'dist/resources',
                    mode: 755
                },
                {
                    expand: true,
                    flatten: true,
                    src: ['src/index.html'],
                    dest: 'dist/',
                    filter: 'isFile'
                }
            ]
        }
    };

    /**
     * -----------------------------------------------------
     *  Minify everything
     * -----------------------------------------------------
     */
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt_config["uglify"] = {
        options: {
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        build: {
            files: {
                'dist/game.min.js': ['dist/game.min.js']
            }
        }
    };

    /**
     * -----------------------------------------------------
     *  Insert code into the html
     * -----------------------------------------------------
     */
    grunt.loadNpmTasks('grunt-injector');
    grunt_config["injector"] = {
        options: {
            ignorePath : "dist",
            // We want everything from the library folder first
            sort : function(a, b) {
                return b.substr(0, 4) === "/lib";
            }
        },
        build: {
            files: {
                'dist/index.html': ['dist/**/*.js', 'dist/**/*.css']
            }
        }
    };

    /**
     * -----------------------------------------------------
     *  Watch for file changes to auto rebuild and reload!
     * -----------------------------------------------------
     */
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt_config["watch"] = {
        options: {
            livereload: true
        },
        all: {
            files: ['src/**/*.js', 'src/**/*.html', 'src/**/*.css'],
            tasks: ['test','build']
        }
    };

    /**
     * -----------------------------------------------------
     *  Create a mini http server for testing purposes
     * -----------------------------------------------------
     */
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt_config["connect"] = {
        server: {
            options: {
                base: 'dist',
                port: webserver_port,
                open: true,
                //keepalive: true,
                livereload: true,
                middleware: function(connect, options, middlewares) {
                    // inject a custom middleware into the array of default middlewares
                    middlewares.unshift(require('connect-livereload')());
                    return middlewares;
                }
            }
        }
    };

    /**
     * -----------------------------------------------------
     *  Register all tasks
     * -----------------------------------------------------
     */

    var run = function() {

        securityMeasures(grunt);

        grunt.task.run(["build"]);
        grunt.task.run(["connect", "watch:all"]);
    };

    // Both are okay
    grunt.task.registerTask('default', 'Build binaries.', run);
    grunt.task.registerTask('run', 'Build binaries.', run);

    grunt.task.registerTask('test', 'Build binaries.', function() {

        securityMeasures(grunt);

        grunt.task.run(["jshint"]);
    });

    grunt.task.registerTask('build', 'Build binaries.', function() {

        securityMeasures(grunt);

        grunt.task.run(
            [
                "test",
                "clean",
                "copy:build",
                "browserify:build",
                "uglify:build",
                "injector:build"
            ]);
    });
};
