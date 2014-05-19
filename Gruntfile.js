/*
 * grunt-require-rev
 * https://github.com/heavymery/grunt-require-rev
 *
 * Copyright (c) 2014 Shindeok Kang
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp/**/*'],
    },
    
    // Work on a copy of the files because they will be renamed during testing.
    copy: {
      test: {
        expand: true,
        cwd: 'test/fixtures/',
        src: ['scripts/**/*.js', 'styles/**/*.css'],
        dest: 'tmp/',
      },
    },

    // Configuration to be run (and then tested).
    requireRev: {
      default_options: {
        src: [
          'tmp/scripts/**/*.js',
          'tmp/styles/*.css'
        ]
      },
      custom_options: {
        options: {
          hash: {
            algorithm: 'md5',
            encoding: 'hex',
            inputEncoding: 'utf8',
            length: 8
          },
          paths: { // key: file path, value: requirejs dependency path
            'scripts': '', // like as requirejs baseUrl == '/scripts'
            'styles': 'css!/styles/' // for requireCSS
          }
        },
        src: [
          'tmp/scripts/**/*.js',
          'tmp/styles/*.css'
        ]
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', [
    'clean', 'copy', 'requireRev:default_options', 'nodeunit',
    //'clean', 'copy', 'require_rev:custom_options', 'nodeunit'
  ]);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
