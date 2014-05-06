'use strict';

define([
  'angular-route',
  'app'
], function (ngRoute, app) {
  
  var defaultRoutePath = '/';
  
  var routes = {
    
    //--------------------------------------
    //  Root
    //--------------------------------------
    
    '/': {
      templateUrl: 'views/top.html',
      dependencies: [
        'controllers/top',
        'css!/styles/top'
      ]
    },
    '/apps': {
      templateUrl: 'views/top.html',
      dependencies: [
        'controllers/top',
        'css!/styles/top'
      ]
    },
    '/about': {
      templateUrl: 'views/top.html',
      dependencies: [
        'controllers/top',
        'css!/styles/top'
      ]
    },
    
    //--------------------------------------
    //  Guitar Tools
    //--------------------------------------
    
    
    //--------------------------------------
    //  D Cre
    //--------------------------------------
    
    '/dcre': {
      //templateUrl: 'views/dcre/top.html',
      templateUrl: 'views/dcre/main.html',
      dependencies: [
        'controllers/dcre/main',
        'css!/styles/dcre'
      ]
    },
    '/dcre/archives': {
      templateUrl: 'views/dcre/archives.html',
      dependencies: [
        'controllers/dcre',
        'css!/styles/dcre'
      ]
    },
    '/dcre/take/:themeId': {
      templateUrl: 'views/dcre/take.html',
      dependencies: [
        'controllers/dcre',
        'css!/styles/dcre',
        'directives/headtrackr'
      ]
    }
    
  };
  
  
  var dependencyResolver = function(dependencies) {
    return {
      resolver: ['$q','$rootScope', function($q, $rootScope) {
        var deferred = $q.defer();

        require(dependencies, function() {
          $rootScope.$apply(function() {
            deferred.resolve();
          });
        });

        return deferred.promise;
      }]
    };
  };
  
  
  app.config(['$routeProvider', function($routeProvider) {
    
    angular.forEach(routes, function(route, path) {
      $routeProvider.when(path, {
        templateUrl:route.templateUrl, 
        resolve:dependencyResolver(route.dependencies)
      });
    });
    
    $routeProvider.otherwise({redirectTo:routes.defaultRoutePaths});
    
  }]);
  
  
});
