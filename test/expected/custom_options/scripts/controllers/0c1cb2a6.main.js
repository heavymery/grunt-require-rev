'use strict';

define(['8fb5d34c.app'], function(app) {
  
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