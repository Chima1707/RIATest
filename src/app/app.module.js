(function () {
  'use strict'

  angular
        .module('App', [
          'ui.bootstrap',
          'ui.router',
          'LocalForageModule',
          'ui.select',
          'ngSanitize',
          'nvd3',
          'angular-loading-bar',
          'ngAnimate'
        ])
        .config(config)

  config.$inject = ['$urlRouterProvider', 'cfpLoadingBarProvider']
  function config ($urlRouterProvider, cfpLoadingBarProvider) {
    cfpLoadingBarProvider.latencyThreshold = 100
    cfpLoadingBarProvider.includeSpinner = false
    $urlRouterProvider.otherwise('/flight-delays')
  }
})()
