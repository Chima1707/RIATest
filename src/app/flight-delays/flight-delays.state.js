(function () {
  'use strict'
  angular
        .module('App')
        .config(stateConfig)

  stateConfig.$inject = ['$stateProvider']

  function stateConfig ($stateProvider) {
    $stateProvider.state('flight-delays', {
      parent: 'app',
      url: '/flight-delays',
      views: {
        'content@': {
          templateUrl: 'app/flight-delays/flight-delays.html',
          controller: 'FlightDelaysController',
          controllerAs: 'vm'
        }
      }
    })
    $stateProvider.state('analysis', {
      parent: 'app',
      url: '/analysis',
      views: {
        'content@': {
          templateUrl: 'app/flight-delays/analysis/analysis.html',
          controller: 'FlightDelaysAnalysisController',
          controllerAs: 'vm'
        }
      }
    })
  }
})()
