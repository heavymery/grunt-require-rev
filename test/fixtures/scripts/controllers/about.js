'use strict';

define(['app'], function(app) {
  
  app.controller('AboutCtrl', [
    '$scope',
    function($scope, $location) {
      $scope.title = 'About';
    }
  ]);
  
});