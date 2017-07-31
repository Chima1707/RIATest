(function () {
  'use strict'

  angular
    .module('App')
    .controller('FlightDelaysAnalysisController', FlightDelaysAnalysisController)

  FlightDelaysAnalysisController.$inject = ['$timeout', 'WEEK_DAYS', 'FlightDelayService', 'FlightDelayChartService', 'flightDelayData', 'cfpLoadingBar']

  function FlightDelaysAnalysisController ($timeout, WEEK_DAYS, FlightDelayService, FlightDelayChartService, flightDelayData, cfpLoadingBar) {
    var vm = this
    vm.chartOptions = { xAxis: 'Distance in miles', yAxis: 'Arrival delay in minutes' }
    vm.analysis = {}
    vm.weekDays = WEEK_DAYS
    vm.flightDelayData = flightDelayData

    vm.selected = { day: '', origin: '' }

    vm.enableSearch = function () { // enable search button.
      return Object.keys(vm.selected).every(function (key) {
        return vm.selected[key]
      })
    }

    vm.search = function () {
      cfpLoadingBar.start()
      $timeout(function () {
        cfpLoadingBar.complete()
        // get delays and corresponding distances for selected params
        var data = FlightDelayService.getDelaysByDistance(vm.selected, vm.flightDelayData.data)
        var chartData = getAnalysisData(data) // format as chart data
        vm.analysis.data = chartData
        vm.analysis.options = FlightDelayChartService.getScatterChartOptions(vm.chartOptions) // get chart params
      }, 1000)
    }
       /**
         * Get the required histogram data. called by both histogram charts
         * @param {Object} data- Object representing delays and distances.
         * @param {Object}  options-  options.
         * @returns {Object} = Object with  Chart Data.
         */
    function getAnalysisData (data) {
      var distances = data.distances
      var delays = data.delays
      var values = distances.map(function (distance, index) {
        return { x: distance, y: delays[index] }
      })

      return [{
        values: values,
        key: 'Arrival delay against distance',
        strokeWidth: 2,
        classed: 'dashed'
      }]
    }
  }
})()
