'use strict';

define('routes', [
  'angular-route',
  'dd9943b7d47d8d43.app'
], function (ngRoute, app) {
  
  var defaultRoutePath = '/';
  
  var routes = {
    
    '/': {
      templateUrl: 'views/top.html',
      dependencies: [
        'controllers/3bcc90986fef773c.top',
        'css!/styles/257aba98c603815c.top'
      ]
    },
    '/apps': {
      templateUrl: 'views/apps.html',
      dependencies: [
        'controllers/70efea67afb45e44.apps',
        'css!/styles/e9c25cf627836979.apps'
      ]
    },
    '/about': {
      templateUrl: 'views/about.html',
      dependencies: [
        'controllers/b8886e5b28451e67.about',
        'css!/styles/ceab9a0c62514c28.about'
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
        route.dependencies.push('services/c447922719bf0856.twitter');
        route.dependencies.push('services/07a6fb8f3f3d6b18.facebook');
      }
      
      $routeProvider.when(path, {
        templateUrl:route.templateUrl, 
        resolve:dependencyResolver(route.dependencies)
      });
    });
    
    $routeProvider.otherwise({redirectTo:routes.defaultRoutePaths});
    
  }]);
  
});
