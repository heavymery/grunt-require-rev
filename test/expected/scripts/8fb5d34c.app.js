'use strict';

define([
  'angular', 
  'angular-touch', 
  'angular-animate'
], function (angular, ngTouch, ngAnimate) {
  
  var app = angular.module('hmApp', [
    'ngRoute', 
    'ngTouch', 
    'ngAnimate'
  ]);
  
  app.config([
    '$controllerProvider', 
    '$compileProvider', 
    '$filterProvider', 
    '$provide', 
    
    function (
      $controllerProvider, 
      $compileProvider, 
      $filterProvider, 
      $provide
    ) {
      
      app.controller = $controllerProvider.register;
      app.directive = $compileProvider.directive;
      app.filter = $filterProvider.register;
      app.factory = $provide.factory;
      app.service = $provide.service;
      
    }
  ]);
  
});

