'use strict';

define('routes', [
  'angular-route',
  '8fb5d34c.app'
], function (ngRoute, app) {
  
  var defaultRoutePath = '/';
  
  var routes = {
    
    '/': {
      templateUrl: 'views/top.html',
      dependencies: [
        'controllers/19a19e3f.top',
        'css!/styles/b3111e1d.top'
      ]
    },
    '/apps': {
      templateUrl: 'views/apps.html',
      dependencies: [
        'controllers/a6d5958b.apps',
        'css!/styles/867ed5ca.apps'
      ]
    },
    '/about': {
      templateUrl: 'views/about.html',
      dependencies: [
        'controllers/198131df.about',
        'css!/styles/cad0421e.about'
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
      if(route == '/about') {
        route.dependencies.push('services/d3dc6308.twitter');
        route.dependencies.push('services/86949311.facebook');
      }
      
      $routeProvider.when(path, {
        templateUrl:route.templateUrl, 
        resolve:dependencyResolver(route.dependencies)
      });
    });
    
    $routeProvider.otherwise({redirectTo:routes.defaultRoutePaths});
    
  }]);
  
});
