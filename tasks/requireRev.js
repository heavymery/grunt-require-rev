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

module.exports = function(grunt) {
  
  var createHashFromFile = function(filepath, fileEncoding, hashAlgorithm, hashEncoding) {
    var hash = crypto.createHash(hashAlgorithm);
    hash.update(grunt.file.read(filepath), fileEncoding);
    grunt.verbose.ok('Hashing ' + filepath + '...');
    return hash.digest(hashEncoding);
  }
  
  grunt.registerMultiTask('requireRev', 'File revisioning for requrejs.', function() {
    
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      hash: {
        algorithm: 'md5',
        encoding: 'hex',
        inputEncoding: 'utf8',
        length: 8
      },
      requirejs: {
        baseUrl: '(scripts|styles)', // カッコは必須
      }
    });
    
    var dependencyPathPattern 
      = new RegExp('(\'|")[\\w\\d-_/.!]+(\'|")','g');
      // e.g. 'app', "controllers/main", "css!/styles/main"
    
    var definePattern 
      = new RegExp('define\\s*\\(\\s*(' + dependencyPathPattern.source + '\\s*,?\\s*)*\\s*\\[\\s*(' + dependencyPathPattern.source + '\\s*,?\\s*)*\\s*\\]', 'ig');
      // e.g. define("moduleName",["app","controllers/main"]... define(["app","controllers/main"]...
    
    var requirePattern 
      = new RegExp('require\\s*\\(\\s*\\[\\s*(' + dependencyPathPattern.source + '\\s*,?\\s*)*\\]\\s*,', 'ig');
      // e.g. require(['app'], 
    
    var dependenciesPattern 
      = new RegExp('(dependencies\\s*:\\s*\\[\\s*(' + dependencyPathPattern.source + '\\s*,?\\s*)*\\]\\s*)|(dependencies\\s*\\.\\s*push\\(\\s*(' + dependencyPathPattern.source + '\\s*,?\\s*)*)', 'ig');
      // e.g. dependencies: ['css!../~','~']... dependencies.push('~');
    
    var dirPathPattern = new RegExp('[\\w\\d-_/.]*');
    
    var filePathPattern = new RegExp('([a-z0-9]{' + options.hash.length + '}\\.)?(([\\w\\d-_/.!]+)\\.(js|css|html))');
    
    var fileToDependencyPath = function(filePath) {
      var regexp = new RegExp(options.requirejs.baseUrl + '/?(' + dirPathPattern.source + ')/' + filePathPattern.source);
      var pathMatch = filePath.match(regexp);
      if(!pathMatch) return '';
      
      var path = '';
      var pathOrigin = '';
      var patternSource = '';
      
      // TODO: オプション化
      if(pathMatch[1] === 'styles') {
        // CSSはRequireCSS用の特殊なパスに変換
        path += 'css!/styles/';
        pathOrigin += 'css!/styles/';
        patternSource += 'css!/styles/'.replace(/\//g,'\\/');
      } else {
        if(pathMatch[2] && pathMatch[2].length>0) {
          path += pathMatch[2] + '/';
          pathOrigin += pathMatch[2] + '/'; 
          patternSource += pathMatch[2].replace(/\//g,'\\/') + '\\/';
        }
      }
      
      // add hash prefix pattern
      patternSource += '([a-z0-9]{' + options.hash.length + '}\\.)?';
      
      // ハッシュプレーフィックス
      if(pathMatch[3] && pathMatch[3].length>0) {
        path += pathMatch[3];
        
        // ハッシュプレーフィックスではない場合もあるのでチィック（数字が入っていれば）
        if(!pathMatch[3].match(/\d/)) {
          pathOrigin += pathMatch[3];
          patternSource += pathMatch[3];
        }
      }
      
      // 拡張子を除いたファイル名
      if(pathMatch[5] && pathMatch[5].length>0) {
        path += pathMatch[5];
        pathOrigin += pathMatch[5];
        patternSource += pathMatch[5];
      }
      
      var pattern = new RegExp(patternSource, 'ig');
      
      return {
        path: path,
        pathOrigin: pathOrigin,
        pattern: pattern
      }
    };
    
    // キャッシュ対応に使う NodeJS モジュール
    var fs = require('fs');
    var path = require('path');
    var crypto = require('crypto');
    
    // 対象ファイルを全て抽出
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
    
    // 各ファイルの依存関係マップ（key: ファイルパス、value: 依存関係パスの配列）
    var dependenciesMap = {};
    
    // 対象のファイルを読み込んで RequireJS の依存関係が記載された部分を抽出
    targetFiles.forEach(function(targetPath) {
      
      var contents = grunt.file.read(targetPath);
      
      var defineMatchs = contents.match(definePattern);
      var requireMatchs = contents.match(requirePattern);
      var dependenciesMatchs = contents.match(dependenciesPattern);
      
      // ちゃんと検索されてるか確認
      grunt.verbose.writeln('Define matchs:\n' + cyan + defineMatchs + reset);
      grunt.verbose.writeln('Require matchs:\n' + cyan + requireMatchs + reset);
      grunt.verbose.writeln('Dependencies matchs:\n' + cyan + dependenciesMatchs + reset);
      grunt.verbose.writeln();
      
      // その中から依存関係パスのみを抽出
      
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

      // 依存関係パスから「'」と「"」を除去
      for(var i=0; i<dependencies.length; i++) {
        dependencies[i] = dependencies[i].replace(/'|"/g,'');
      }

      // 重複するパスアイテムを削除
      for(var i=0; i<dependencies.length; i++) {
        var target = dependencies[i];
        var indexOfNext = dependencies.indexOf(target, i + 1);
        if(indexOfNext > 0) {
          dependencies.splice(indexOfNext, 1);
          i--;
        }
      }
      
      dependenciesMap[targetPath] = {};
      dependenciesMap[targetPath].requirePath = fileToDependencyPath(targetPath);
      dependenciesMap[targetPath].dependencies = dependencies;
    }); // targetFiles.forEach

    // 配列の中からパターンマッチ結果を返す
    var matchPatternArray = function(array, pattern) {
      //console.log(array);
      //console.log(pattern);

      for(var i=0; i<array.length; i++) {
        //console.log(array[i]);
        var match = array[i].match(pattern);
        if(match) {
          //console.log('match!');
          return match;
        }
      }
      
      return null;
    };
    
    //console.log();
    //console.log(green + targetFiles.join('\n') + reset);
    //console.log();
    
    // 対象のファイルリストを依存関係順にソート
    
    var targetFilesSorted = [];
    
    while(targetFiles.length > 0) {
      if(targetFilesSorted.length > 0) {
        var nextTarget = targetFiles.pop();
        
        for(var i=0; i<targetFilesSorted.length; i++) {
          var targetFile = targetFilesSorted[i];
          var dependencies = dependenciesMap[targetFile].dependencies;
          
          //console.log(nextTarget);
          var dependencyMatch = matchPatternArray(dependencies, dependenciesMap[nextTarget].requirePath.pattern);
          //console.log(red + dependencyMatch + reset);
          if(dependencyMatch) {
            //console.log(red + 'break!' + reset);
            break;
          }
        }
        
        // 依存しているファイルを前に持って行く
        targetFilesSorted.splice(i, 0, nextTarget);
        
      } else {
        targetFilesSorted.push(targetFiles.pop());
      }
    }
    
    grunt.verbose.writeln();
    
    // ファイル名を変更し、参照する箇所のパスも更新
    
    targetFilesSorted.forEach(function(targetPath) {
      var dependencies = dependenciesMap[targetPath].dependencies;
      
      grunt.verbose.ok('Target ' + targetPath + ' (' 
        + dependenciesMap[targetPath].requirePath.path + ' | ' 
        + dependenciesMap[targetPath].requirePath.pathOrigin + ' | ' 
        + dependenciesMap[targetPath].requirePath.pattern + ')');
      
      grunt.verbose.writeln(red + dependencies.length + reset + ' dependencies found.');
      if(dependencies && dependencies.length > 0) {
        grunt.verbose.writeln(magenta + dependencies.join('\n') + reset);
      }
      grunt.verbose.writeln();
    });
    
    for(var i=0; i<targetFilesSorted.length; i++) {
      var targetPath = targetFilesSorted[i];
      
      var hash = createHashFromFile(targetPath, options.hash.inputEncoding, options.hash.algorithm, options.hash.encoding);
      var prefix = hash.slice(0, options.hash.length);
      //console.log(targetPath);
      var originName = path.basename(targetPath);
      //console.log(originName);
      
      // すでにハッシュプレーフィックスが付いてる場合は除去
      var filePathMatch = originName.match(filePathPattern);
      if(filePathMatch && filePathMatch[1] && filePathMatch[1].match(/\d/)) {
        originName = filePathMatch[2];
      }
      
      var targetPathNew = path.dirname(targetPath) + '/' + prefix + '.' +  originName;
      grunt.verbose.write('Rename ' + targetPath + ' to ' + targetPathNew + '...');
      
      // ファイル名を更新
      fs.renameSync(targetPath, targetPathNew);
      grunt.verbose.ok();
      
      // RequireJS用パス情報を更新
      dependenciesMap[targetPath].requirePath = fileToDependencyPath(targetPathNew);
      
      for(var j=i+1; j<targetFilesSorted.length; j++) {
        var otherPath = targetFilesSorted[j];
        
        var dependencyMatch = matchPatternArray(dependenciesMap[otherPath].dependencies, dependenciesMap[targetPath].requirePath.pattern);
        if(dependencyMatch) {
          grunt.verbose.ok('Replace require path for ' + otherPath + '...');

          var contents = grunt.file.read(otherPath);
          
          grunt.file.write(otherPath, contents.replace(
            new RegExp('("|\')' + dependenciesMap[targetPath].requirePath.pattern.source + '("|\')', 'ig'), 
            '$1' + dependenciesMap[targetPath].requirePath.path + '$3'
          ));
        }
      }
      
      grunt.verbose.writeln();
    }
    
  });

};
