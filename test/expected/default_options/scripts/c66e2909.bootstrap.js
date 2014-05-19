'use strict';

require.config({
  baseUrl: '/scripts',
  paths: { 
    'require-css': '../bower_components/require-css/css',
    'angular': '../bower_components/angular/angular.min',
    'angular-route': '../bower_components/angular-route/angular-route.min',
    'angular-touch': '../bower_components/angular-touch/angular-touch.min',
    'angular-animate': '../bower_components/angular-animate/angular-animate.min'
  },
  
  map: {
    '*': {
      'css': 'require-css'
    }
  },
  
  shim: {
    'angular': {
      exports: 'angular'
    },
    'angular-route': {
      deps: ['angular']
    },
    'angular-touch': {
      deps: ['angular']
    },
    'angular-animate': {
      deps: ['angular']
    }
  }
});

require([
    'require-css', 
    'angular', 
    '8fb5d34c.app', 
    'b31b118b.routes', 
    'controllers/5daa89c5.main',
  ],
  function(requireCss, angular, app) {
    angular.bootstrap(document, [app.name]);
  }
);