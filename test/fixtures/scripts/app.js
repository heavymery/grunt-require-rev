'use strict';

define([
  'angular', 
  'angular-touch', 
  'angular-animate'
], function (angular, ngTouch, ngAnimate) {
  
  //------------------------------------------------------------------------------
  //
  //  Application module
  //
  //------------------------------------------------------------------------------
  
  var app = angular.module('hmApp', [
    'ngRoute', 
    'ngTouch', 
    'ngAnimate'
  ]);
  
  //--------------------------------------
  //  Config
  //--------------------------------------
  
  app.config([
    //'$routeProvider', 
    '$locationProvider', 
    '$controllerProvider', 
    '$compileProvider', 
    '$filterProvider', 
    '$provide', 
    '$sceDelegateProvider', 
    
    function (
      //$routeProvider, 
      $locationProvider, 
      $controllerProvider, 
      $compileProvider, 
      $filterProvider, 
      $provide, 
      $sceDelegateProvider
    ) {
      
      app.controller = $controllerProvider.register;
      app.directive = $compileProvider.directive;
      app.filter = $filterProvider.register;
      app.factory = $provide.factory;
      app.service = $provide.service;
      
      //$locationProvider.html5Mode(true);
      //$locationProvider.html5Mode(true).hashPrefix('!'); // not good ?
      
      $sceDelegateProvider.resourceUrlWhitelist([
        '^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?\(vimeo|youtube)\.com(/.*)?$', 
        'self'
      ]);
      //$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
      $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file):|data:image\/|filesystem:https:/);
      
    }
  ]);
  
  //----------------------------------
  //  Run
  //----------------------------------
  
  app.run(['$document', function($document) {
    // TODO: initialisze or some test code
    
    //$document[0].body.style.opacity = 1 // this is incorrect
    //$document[0].body.style.visibility = 'visible'; // this is incorrect
  }]);

  return app;
});

