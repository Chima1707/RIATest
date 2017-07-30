(function () {
  'use strict'

  angular
        .module('App', [
          'ui.bootstrap',
          'ui.router',
          'LocalForageModule',
          'ui.select',
          'ngSanitize',
          'nvd3'
        ])
        .config(config)

  config.$inject = ['$urlRouterProvider']
  function config ($urlRouterProvider) {
    $urlRouterProvider.otherwise('/flight-delays')
  }
})()
