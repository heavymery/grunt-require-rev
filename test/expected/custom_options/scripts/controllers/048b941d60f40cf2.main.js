'use strict';

define(['dd9943b7d47d8d43.app'], function(app) {
  
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
            require('services/07a6fb8f3f3d6b18.facebook', function(facebook){
              $scope.feeds = facebook.getNewFeeds();
            });
            break;
          case 'twitter':
            require('services/c447922719bf0856.twitter', function(twitter){
              $scope.feeds = twitter.getNewFeeds();
            });
            break;
        }
      }
      
    }
  ]);
  
});