'use strict';

var request = require('request');
var envify = require('envify');
var env = process.env.REAL_ENV || process.env.NODE_ENV || 'development';

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'server.js'
      }
    },
    sass: {
      options: {
          sourceMap: 'auto'
        },
      dist: {
        files: {
          'public/css/style.css' : 'public/scss/style.scss'
        }
      }
    },
    watch: {
      options: {
          nospawn: true,
          livereload: reloadPort
      },
      js: {
        files: [
          '*.js',
          'configs/**/*.js',
          'services/**/*.js',
          'lib/**/*.js',
          'stores/**/*.js',
          'actions/**/*.js',
          'components/**/*.jsx',
          'components/*.jsx',
        ],
        tasks: ['watchify', 'develop', 'delayed-livereload']
      },
      views: {
        files: [
          'views/*.swig',
          'views/**/*.swig'
        ],
        options: { livereload: reloadPort }
      },
      css: {
        files: 'public/scss/**/*.scss',
        tasks: ['sass']
      }
    },
    wiredep: {
      task: {
        src: [
          'views/**/*.swig',
          'public/scss/**/*.scss',
        ],

        options: {
          // https://github.com/taptapship/wiredep#configuration
          ignorePath: '/public'
        }
      }
    },
    browserify: {
      options: {
        transform: [
          require('grunt-react').browserify,
          envify
        ]
      },
      client: {
        src: 'client.js',
        dest: 'public/build/js/app.js'
      }
    },
    watchify: {
      options: {
          // defaults options used in b.bundle(opts)
          detectGlobals: true,
          insertGlobals: false,
          ignoreMissing: false,
          debug: true,
          standalone: false,
          keepalive: false,
          callback: function(b) {
            b.transform(require('grunt-react').browserify);
            return b;
          }
        },
        client: {
          src: ['process', './client.js'],
          dest: 'public/build/js/app.js'
        }
    }
  });

  grunt.config.requires('watch.js.files');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function(err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded)
            grunt.log.ok('Delayed live reload successful.');
          else
            grunt.log.error('Unable to make a delayed live reload.');
          done(reloaded);
        });
    }, 500);
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-watchify');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.registerTask('default', ['develop', 'watchify', 'watch', 'sass']);
};
