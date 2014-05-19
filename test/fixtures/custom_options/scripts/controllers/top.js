'use strict';

define(['app'], function(app) {
  
  app.controller('TopCtrl', [
    '$scope',
    function($scope) {
      $scope.title = 'Top';
    }
  ]);
  
});