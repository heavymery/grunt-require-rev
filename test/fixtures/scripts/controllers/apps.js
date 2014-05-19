'use strict';

define(['app'], function(app) {
  
  app.controller('AppsCtrl', [
    '$scope',
    function($scope, $location) {
      $scope.title = 'Apps';
    }
  ]);
  
});