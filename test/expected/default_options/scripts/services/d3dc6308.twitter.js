'use strict';

define(['8fb5d34c.app'], function(app) {
  
  app.service('twitter', ['$http', function($http) {
    return {
      getNewFeeds: function() {
        return ['test', 'test', 'test'];
      }
    }
  }
  
});