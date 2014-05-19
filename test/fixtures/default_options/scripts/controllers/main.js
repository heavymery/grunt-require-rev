'use strict';

define(['app'], function(app) {
  
  app.controller('MainCtrl', [
    '$scope',
    '$location',
    function($scope, $location) {
      
      $scope.navigate = function(path, search) {
        if(path) {
          $location.path(path);
        }
        
        if(search) {
          $location.search(search);
        }
      };
      
    }
  ]);
  
});