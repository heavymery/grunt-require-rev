'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.require_rev = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  default_options: function(test) {
    test.expect(1);

    var expectedFiles = {};
    var actualFiles = {};

    grunt.file.recurse('test/expected/default_options', function(abspath, rootdir, subdir, filename){
      expectedFiles[subdir + '/' + filename] = grunt.file.read(abspath);
    });

    grunt.file.recurse('tmp/default_options', function(abspath, rootdir, subdir, filename){
      actualFiles[subdir + '/' + filename] = grunt.file.read(abspath);
    });

    var expected;
    var actual;

    for(var expectedFile in expectedFiles) {
      expected += expectedFile + expectedFiles[expectedFile];
    }

    for(var actualFile in actualFiles) {
      actual += actualFile + actualFiles[actualFile];
    }

    test.equal(expected, actual, 'Actual files not match to expected.');

    test.done();
  },

  custom_options: function(test) {
    test.expect(1);

    var expectedFiles = {};
    var actualFiles = {};

    grunt.file.recurse('test/expected/custom_options', function(abspath, rootdir, subdir, filename){
      expectedFiles[subdir + '/' + filename] = grunt.file.read(abspath);
    });

    grunt.file.recurse('tmp/custom_options', function(abspath, rootdir, subdir, filename){
      actualFiles[subdir + '/' + filename] = grunt.file.read(abspath);
    });

    var expected;
    var actual;

    for(var expectedFile in expectedFiles) {
      expected += expectedFile + expectedFiles[expectedFile];
    }

    for(var actualFile in actualFiles) {
      actual += actualFile + actualFiles[actualFile];
    }

    test.equal(expected, actual, 'Actual files not match to expected.');

    test.done();
  },
};
