'use strict';

define(['app'], function(app) {
  
  app.service('twitter', ['$http', function($http) {
    return {
      getNewFeeds: function() {
        return ['test', 'test', 'test'];
      }
    }
  }
  
});