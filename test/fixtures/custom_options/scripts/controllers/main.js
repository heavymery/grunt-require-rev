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
      
      $scope.selectedSNSType = 'facebook';
      
      $scope.getNewFeeds = function() {
        switch($scope.selectedSNSType) {
          case 'facebook':
            require('services/facebook', function(facebook){
              $scope.feeds = facebook.getNewFeeds();
            });
            break;
          case 'twitter':
            require('services/twitter', function(twitter){
              $scope.feeds = twitter.getNewFeeds();
            });
            break;
        }
      }
      
    }
  ]);
  
});