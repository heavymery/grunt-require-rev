'use strict';

require.config({
  baseUrl: '/scripts',
  paths: { 
    'require-css': '../bower_components/require-css/css',
    'angular': '../bower_components/angular/angular.min',
    'angular-route': '../bower_components/angular-route/angular-route.min',
    'angular-touch': '../bower_components/angular-touch/angular-touch.min',
    'angular-animate': '../bower_components/angular-animate/angular-animate.min',
    //'angular-cookies': '../bower_components/angular-cookies/angular-cookies.min',
    //'json3': '../bower_components/json3/lib/json3.min',
    'easeljs': '../bower_components/easeljs/lib/easeljs-0.7.1.min',
    'tweenjs': '../bower_components/TweenJS/lib/tweenjs-0.5.1.min',
    'soundjs': '../bower_components/TweenJS/lib/soundjs-0.5.2.min',
    'preloadjs': '../bower_components/PreloadJS/lib/preloadjs-0.4.1.min'
  },
  
  map: {
    '*': {
      'css': 'require-css' // or whatever the path to require-css is
    }
  },
  
  //urlArgs: "bust=v1",
  
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
    'app', 
    'routes', 
    'controllers/main',
  ],
  function(requireCss, angular, app) {
    angular.bootstrap(document, [app.name]);
  }
);