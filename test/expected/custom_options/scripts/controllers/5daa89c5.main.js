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
      
      $scope.selectedSNSType = 'facebook';
      
      $scope.getNewFeeds = function() {
        switch($scope.selectedSNSType) {
          case 'facebook':
            require('services/86949311.facebook', function(facebook){
              $scope.feeds = facebook.getNewFeeds();
            });
            break;
          case 'twitter':
            require('services/d3dc6308.twitter', function(twitter){
              $scope.feeds = twitter.getNewFeeds();
            });
            break;
        }
      }
      
    }
  ]);
  
});