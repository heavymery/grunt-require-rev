# grunt-require-rev v0.1.0

> File revisioning for RequireJS dependencies.
This can be useful for caching and cache-busting with RequireJS.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-require-rev --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-require-rev');
```

## The "requireRev" task

### Overview
In your project's Gruntfile, add a section named `requireRev` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  requireRev: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### hash.algorithm
Type: `String`
Default value: `'md5'`

Hashing algorithm for file revisioning.
>algorithm is dependent on the available algorithms supported by the version of OpenSSL on the platform. Examples are 'sha1', 'md5', 'sha256', 'sha512', etc. On recent releases, openssl list-message-digest-algorithms will display the available digest algorithms.

#### hash.inputEncoding
Type: `String`
Default value: `'utf8'`

The encoding of intput file contents.

#### hash.length
Type: `Number`
Default value: `8`

A number of hash prefix length.

#### paths
Type: `Objects`
Default value: `'{ scripts: '' }'`

Related file and dependency path base.
(`key`: file path base, `value`: requirejs dependency path base)

### Usage Examples

#### Default Options

Revisioning all target files and replace dependency paths.

```js
grunt.initConfig({
  requireRev: {
    expand: true,
    cwd: 'dist',
    src: [
      'scripts/**/*.js'
    ]
  },
});
```

Before: 

```
+- dist
|   +- scripts
|       +- bootstrap.js
|       +- app.js
|       +- routes.js
|       +- controllers
|          +- main.js
|          +- top.js
|          +- apps.js
|          +- about.js
|       +- services
|          +- facebook.js
|          +- twitter.js
```

```js
/* bootstrap.js */
require([
    'angular', 
    'app', 
    'routes', 
    'controllers/main',
  ],
  function(requireCss, angular, app) {
    angular.bootstrap(document, [app.name]);
  }
);

/* routes.js */
var routes = {
  '/': {
    templateUrl: 'views/top.html',
    dependencies: [
      'controllers/top'
    ]
  }
}

angular.forEach(routes, function(route, path) {
  if(route == '/about') {
    route.dependencies.push('services/twitter');
    route.dependencies.push('services/facebook');
  }
});

/* controllers/main.js */
define(['app'], function(app) {
  
  app.controller('MainCtrl', [
    '$scope',
    '$location',
    function($scope, $location) {
    
      $scope.getNewFeeds = function() {
        switch($scope.selectedSNSType) {
          case 'facebook':
            require('services/facebook', function(facebook){
              $scope.feeds = facebook.getNewFeeds();
            });
            break;
          case 'twitter':
            require('services/twitter', function(twitter){
              $scope.feeds = twitter.getNewFeeds();
            });
            break;
        }
      }
      
    }
  ]);
  
});
```

After: 

```
+- dist
|   +- scripts
|       +- bd7daeb5.bootstrap.js
|       +- 8fb5d34c.app.js
|       +- 4573763f.routes.js
|       +- controllers
|          +- 5daa89c5.main.js
|          +- 19a19e3f.top.js
|          +- a6d5958b.apps.js
|          +- 198131df.about.js
|       +- services
|          +- 86949311.facebook.js
|          +- d3dc6308.twitter.js
```

```js
/* bd7daeb5.bootstrap.js */
require([
    'angular', 
    '8fb5d34c.app', 
    '4573763f.routes', 
    'controllers/5daa89c5.main',
  ],
  function(requireCss, angular, app) {
    angular.bootstrap(document, [app.name]);
  }
);

/* 4573763f.routes.js */
var routes = {
  '/': {
    templateUrl: 'views/top.html',
    dependencies: [
      'controllers/19a19e3f.top'
    ]
  }
}

angular.forEach(routes, function(route, path) {
  if(route == '/about') {
    route.dependencies.push('services/86949311.facebook');
    route.dependencies.push('services/d3dc6308.twitter');
  }
});

/* controllers/5daa89c5.main.js */
define(['8fb5d34c.app'], function(app) {
  
  app.controller('MainCtrl', [
    '$scope',
    '$location',
    function($scope, $location) {
    
      $scope.getNewFeeds = function() {
        switch($scope.selectedSNSType) {
          case 'facebook':
            require('services/86949311.facebook', function(facebook){
              $scope.feeds = facebook.getNewFeeds();
            });
            break;
          case 'twitter':
            require('services/d3dc6308.twitter', function(twitter){
              $scope.feeds = twitter.getNewFeeds();
            });
            break;
        }
      }
      
    }
  ]);
  
});
```

#### Custom Options

```js
grunt.initConfig({
  requireRev: {
    options: {
      hash: {
        algorithm: 'sha1',
        length: 16
      },
      paths: {
        styles: 'css!/styles/' // for requireCSS
      }
    },
    expand: true,
    cwd: 'dist',
    src: [
      'scripts/**/*.js',
      'styles/**/*.css'
    ]
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

 * 2014-5-20   v0.1.0   Initial release.
