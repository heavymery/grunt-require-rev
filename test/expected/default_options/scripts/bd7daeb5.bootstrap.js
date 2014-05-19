'use strict';

require.config({
  baseUrl: '/scripts',
  paths: { 
    'angular': '../bower_components/angular/angular.min',
    'angular-route': '../bower_components/angular-route/angular-route.min',
    'angular-touch': '../bower_components/angular-touch/angular-touch.min',
    'angular-animate': '../bower_components/angular-animate/angular-animate.min'
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
    'angular', 
    '8fb5d34c.app', 
    '4573763f.routes', 
    'controllers/5daa89c5.main',
  ],
  function(requireCss, angular, app) {
    angular.bootstrap(document, [app.name]);
  }
);