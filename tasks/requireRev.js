/*
 * grunt-require-rev
 * https://github.com/heavymery/grunt-require-rev
 *
 * Copyright (c) 2014 Shindeok Kang
 * Licensed under the MIT license.
 */

'use strict';

// Console color code
var black   = '\u001b[30m';
var red     = '\u001b[31m';
var green   = '\u001b[32m';
var yellow  = '\u001b[33m';
var blue    = '\u001b[34m';
var magenta = '\u001b[35m';
var cyan    = '\u001b[36m';
var white   = '\u001b[37m';
var reset   = '\u001b[0m';

// file hashing modules
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

module.exports = function(grunt) {
  
  var createHashFromFile = function(filepath, fileEncoding, hashAlgorithm) {
    var hash = crypto.createHash(hashAlgorithm);
    hash.update(grunt.file.read(filepath), fileEncoding);
    grunt.verbose.ok('Hashing ' + filepath + '...');
    return hash.digest('hex');
  }
  
  grunt.registerMultiTask('requireRev', 'File revisioning for requrejs.', function() {
    
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      hash: {
        algorithm: 'md5',
        inputEncoding: 'utf8',
        length: 8
      },
      paths: { // key: file path, value: requirejs dependency path
        'scripts': '', // like as requirejs baseUrl == '/scripts'
        'styles': 'css!/styles/' // for requireCSS
      }
    });
    
    var dirPathPattern = new RegExp('[\\w\\d-_/.]*');
    
    var hashPrefixPatternSource = '([a-zA-Z0-9]{' + options.hash.length + '}\\.)?';
    
    var filePathPattern = new RegExp(hashPrefixPatternSource + '(([\\w\\d-_/.!]+)\\.(js|css|html))');
    
    var dependencyPathPattern 
      = new RegExp('(\'|")[\\w\\d-_/.!]+(\'|")','g');
      // e.g. 'app', "controllers/main", "css!/styles/main"
    
    var definePattern 
      = new RegExp('define\\s*\\(\\s*(' + dependencyPathPattern.source + '\\s*,?\\s*)*\\s*\\[\\s*(' + dependencyPathPattern.source + '\\s*,?\\s*)*\\s*\\]', 'ig');
      // e.g. define("moduleName",["app","controllers/main"]... define(["app","controllers/main"]...
    
    var requirePattern 
      = new RegExp('(require\\s*\\(\\s*\\[\\s*(' + dependencyPathPattern.source + '\\s*,?\\s*)*\\]\\s*)|(require\\s*\\(\\s*(' + dependencyPathPattern.source + '\\s*,?\\s*)*)', 'ig');
      // e.g. require(['app']... require('app'...
    
    var dependenciesPattern 
      = new RegExp('(dependencies\\s*(:|=)\\s*\\[\\s*(' + dependencyPathPattern.source + '\\s*,?\\s*)*\\]\\s*)|(dependencies\\s*\\.\\s*push\\(\\s*(' + dependencyPathPattern.source + '\\s*,?\\s*)*)', 'ig');
      // e.g. dependencies: ['css!../~','~']... dependencies = ['css!../~','~']... dependencies.push('~');
    
    var matchPatternFromArray = function(array, pattern) {
      for(var i=0; i<array.length; i++) {
        var match = array[i].match(pattern);
        if(match) {
          return match;
        }
      }
      
      return null;
    };
    
    var fileToDependencyPath = function(filePath) {
      var fileBasePathPattern = '(' + Object.keys(options.paths).join('|') + ')';
      var regexp = new RegExp(fileBasePathPattern + '/?(' + dirPathPattern.source + ')/' + filePathPattern.source);
      
      var pathMatch = filePath.match(regexp);
      if(!pathMatch) return '';
      
      var fileBasePath = pathMatch[1];
      var dependencyBasePath = options.paths[fileBasePath];
      
      // set base dependency path
      var path = dependencyBasePath;
      var pathOrigin = dependencyBasePath;
      var patternSource = dependencyBasePath.replace(/\//g,'\\/');
      
      // add sub dependency path
      if(pathMatch[2] && pathMatch[2].length>0) {
        path += pathMatch[2] + '/';
        pathOrigin += pathMatch[2] + '/'; 
        patternSource += pathMatch[2].replace(/\//g,'\\/') + '\\/';
      }
      
      // add hash prefix pattern
      patternSource += hashPrefixPatternSource;
      
      // add hash prefix
      if(pathMatch[3] && pathMatch[3].length>0) {
        path += pathMatch[3];
      }
      
      // add file name (exclude extension)
      if(pathMatch[5] && pathMatch[5].length>0) {
        path += pathMatch[5];
        pathOrigin += pathMatch[5];
        patternSource += pathMatch[5];
      }
      
      // create regular expression 
      var pattern = new RegExp(patternSource, 'ig');
      
      return {
        path: path,
        pathOrigin: pathOrigin,
        pattern: pattern
      }
    };
    
    //--------------------------------------
    // 1. get target files
    //--------------------------------------
    
    var targetFiles = [];
    
    this.files.forEach(function(filePair) {
      filePair.src.forEach(function(file) {
        targetFiles.push(file);
      });
    });
    
    grunt.verbose.writeln();
    grunt.verbose.writeln('Target files:');
    grunt.verbose.writeln(green + targetFiles.join('\n') + reset);
    grunt.verbose.writeln();
    
    //--------------------------------------
    // 2. create dependencies map
    //  (key: filePath, value: dependencies)
    //--------------------------------------
    
    var dependenciesMap = {};
    
    targetFiles.forEach(function(targetPath) {
      
      var contents = grunt.file.read(targetPath);
      
      var defineMatchs = contents.match(definePattern);
      var requireMatchs = contents.match(requirePattern);
      var dependenciesMatchs = contents.match(dependenciesPattern);
      
      grunt.verbose.writeln('Define matchs:\n' + cyan + defineMatchs + reset);
      grunt.verbose.writeln('Require matchs:\n' + cyan + requireMatchs + reset);
      grunt.verbose.writeln('Dependencies matchs:\n' + cyan + dependenciesMatchs + reset);
      grunt.verbose.writeln();
      
      // dependency path array
      var dependencies = [];
      
      if(defineMatchs) {
        defineMatchs.forEach(function(defineMatch) {
          var pathMatchs = defineMatch.match(dependencyPathPattern);
          if(pathMatchs) {
            dependencies = dependencies.concat(defineMatch.match(dependencyPathPattern));
          }
        });
      }
      
      if(requireMatchs) {
        requireMatchs.forEach(function(requireMatch) {
          var pathMatchs = requireMatch.match(dependencyPathPattern);
          if(pathMatchs) {
            dependencies = dependencies.concat(pathMatchs);
          }
        });
      }
      
      if(dependenciesMatchs) {
        dependenciesMatchs.forEach(function(dependenciesMatch) {
          var pathMatchs = dependenciesMatch.match(dependencyPathPattern);
          if(pathMatchs) {
            dependencies = dependencies.concat(pathMatchs);
          }
        });
      }
      
      // remove quotation mark
      for(var i=0; i<dependencies.length; i++) {
        dependencies[i] = dependencies[i].replace(/'|"/g,'');
      }
      
      // remove duplicate dependency path
      for(var i=0; i<dependencies.length; i++) {
        var target = dependencies[i];
        var indexOfNext = dependencies.indexOf(target, i + 1);
        if(indexOfNext > 0) {
          dependencies.splice(indexOfNext, 1);
          i--;
        }
      }
      
      dependenciesMap[targetPath] = {};
      dependenciesMap[targetPath].dependencyPath = fileToDependencyPath(targetPath);
      dependenciesMap[targetPath].dependencies = dependencies;
    });
    
    //--------------------------------------
    // 3. order by dependencies
    //--------------------------------------
    
    var targetFilesSorted = [];
    
    while(targetFiles.length > 0) {
      if(targetFilesSorted.length > 0) {
        var nextTarget = targetFiles.pop();
        
        for(var i=0; i<targetFilesSorted.length; i++) {
          var targetFile = targetFilesSorted[i];
          var dependencies = dependenciesMap[targetFile].dependencies;
          
          var dependencyMatch = matchPatternFromArray(dependencies, dependenciesMap[nextTarget].dependencyPath.pattern);
          
          if(dependencyMatch) {
            break;
          }
        }
        
        // move dependent file to front
        targetFilesSorted.splice(i, 0, nextTarget);
        
      } else {
        targetFilesSorted.push(targetFiles.pop());
      }
    }
    
    grunt.verbose.writeln();
    
    //--------------------------------------
    // 4. hashing & replace dependency path
    //--------------------------------------
    
    targetFilesSorted.forEach(function(targetPath) {
      var dependencies = dependenciesMap[targetPath].dependencies;
      
      grunt.verbose.ok('Target ' + targetPath + ' (' 
        + dependenciesMap[targetPath].dependencyPath.path + ' | ' 
        + dependenciesMap[targetPath].dependencyPath.pathOrigin + ' | ' 
        + dependenciesMap[targetPath].dependencyPath.pattern + ')');
      
      grunt.verbose.writeln(red + dependencies.length + reset + ' dependencies found.');
      if(dependencies && dependencies.length > 0) {
        grunt.verbose.writeln(magenta + dependencies.join('\n') + reset);
      }
      grunt.verbose.writeln();
    });
    
    for(var i=0; i<targetFilesSorted.length; i++) {
      var targetPath = targetFilesSorted[i];
      var originName = path.basename(targetPath);
      
      var hash = createHashFromFile(targetPath, options.hash.inputEncoding, options.hash.algorithm);
      var prefix = hash.slice(0, options.hash.length);
      
      // clear hash prefix from file name
      var filePathMatch = originName.match(filePathPattern);
      if(filePathMatch && filePathMatch[1] && filePathMatch[1].match(/\d/)) {
        originName = filePathMatch[2];
      }
      
      var targetPathNew = path.dirname(targetPath) + '/' + prefix + '.' +  originName;
      grunt.verbose.write('Rename ' + targetPath + ' to ' + targetPathNew + '...');
      
      // rename file (adding hash prefix)
      fs.renameSync(targetPath, targetPathNew);
      grunt.verbose.ok();
      
      // replace dependency path
      dependenciesMap[targetPath].dependencyPath = fileToDependencyPath(targetPathNew);
      
      for(var j=i+1; j<targetFilesSorted.length; j++) {
        var otherPath = targetFilesSorted[j];
        
        var dependencyMatch = matchPatternFromArray(dependenciesMap[otherPath].dependencies, dependenciesMap[targetPath].dependencyPath.pattern);
        if(dependencyMatch) {
          grunt.verbose.ok('Replace require path for ' + otherPath + '...');

          var contents = grunt.file.read(otherPath);
          
          grunt.file.write(otherPath, contents.replace(
            new RegExp('("|\')' + dependenciesMap[targetPath].dependencyPath.pattern.source + '("|\')', 'ig'), 
            '$1' + dependenciesMap[targetPath].dependencyPath.path + '$3'
          ));
        }
      }
      
      grunt.verbose.writeln();
    }
    
    
  }); // grunt.registerMultiTask
  
}; // module.exports
