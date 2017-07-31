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
        .constant('WEEK_DAYS', [
            { id: 0, name: 'Sunday' },
            { id: 1, name: 'Monday' },
            { id: 2, name: 'Tuesday' },
            { id: 3, name: 'Wednesday' },
            { id: 4, name: 'Thursday' },
            { id: 5, name: 'Friday' },
            { id: 6, name: 'Saturday' }
        ])

  config.$inject = ['$urlRouterProvider', 'cfpLoadingBarProvider']
  function config ($urlRouterProvider, cfpLoadingBarProvider) {
    cfpLoadingBarProvider.latencyThreshold = 100
    cfpLoadingBarProvider.includeSpinner = false
    $urlRouterProvider.otherwise('/flight-delays')
  }
})()
