'use strict';

define(['app'], function(app) {
  
  app.controller('MainCtrl', [
    '$scope',
    '$location',
    '$routeParams',
    function($scope, $location, $routeParams) {
      
      $scope.navigate = function(path, search) {
        if(path) {
          $location.path(path);
        }
        
        if(search) {
          $location.search(search);
        }
      };
      
      $scope.currentPath = '/';
      
      $scope.$on('$routeChangeSuccess', function($event, current) {
        $scope.currentPath = $location.$$path;
      });
      
      $scope.routeParams = $routeParams;
      
    }
  ]);
  
});