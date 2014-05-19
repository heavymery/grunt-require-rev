'use strict';

define(['app'], function(app) {
  
  app.service('facebook', ['$http', function($http) {
    return {
      getNewFeeds: function() {
        return ['test', 'test', 'test'];
      }
    }
  }
  
});

