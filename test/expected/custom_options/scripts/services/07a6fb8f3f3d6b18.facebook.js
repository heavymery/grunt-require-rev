'use strict';

define(['dd9943b7d47d8d43.app'], function(app) {
  
  app.service('facebook', ['$http', function($http) {
    return {
      getNewFeeds: function() {
        return ['test', 'test', 'test'];
      }
    }
  }
  
});

