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
    'app', 
    'routes', 
    'controllers/main',
  ],
  function(requireCss, angular, app) {
    angular.bootstrap(document, [app.name]);
  }
);