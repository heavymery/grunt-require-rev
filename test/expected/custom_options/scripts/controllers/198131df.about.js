'use strict';

define(['8fb5d34c.app'], function(app) {
  
  app.controller('AboutCtrl', [
    '$scope',
    function($scope, $location) {
      $scope.title = 'About';
    }
  ]);
  
});