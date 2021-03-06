(function () {
  'use strict'

  angular
        .module('App')
        .controller('FlightDelaysController', FlightDelaysController)

  FlightDelaysController.$inject = ['$timeout', 'WEEK_DAYS', 'FlightDelayService', 'FlightDelayChartService', 'flightDelayData', 'cfpLoadingBar']

  function FlightDelaysController ($timeout, WEEK_DAYS, FlightDelayService, FlightDelayChartService, flightDelayData, cfpLoadingBar) {
    var vm = this
    vm.flightDelayData = flightDelayData
    vm.selected = { day: '', origin: '', destination: '' } // keep track of search parameters

    vm.weekDays = WEEK_DAYS

    var chartOptions = {
      arrivalDelayTime: { // keep track of arrival delays chart options
        bins: 24,
        max: 0,
        intervals: 60,
        xAxis: 'Hour of the day (departure time)',
        yAxis: 'Frequency of arrival delays'
      },
      arrivalDelayRatio: { // keep track of arrival delay ratio chart options.
        xAxisFormat: null,
        bins: 10,
        max: 0,
        intervals: 10,
        xAxis: 'Delay ratio in %',
        yAxis: 'Frequency of arrival delay  ratio',
        drawLine: { value: 0, text: 'Average(%) is ', chartId: 'ratios' }
      }
    }

    function preBind (interval) { // prebind interval to x axis chart tick
      return function (d) {
        return Math.round(d * interval)
      }
    }

    vm.chartData = {} //
    vm.histogramOptions = {}

    vm.enableSearch = function () { // enable search button.
      return FlightDelayService.validateQuery(vm.selected)
    }

    vm.search = function () {
      cfpLoadingBar.start()

      $timeout(function () {
        cfpLoadingBar.complete()
        // get data that matches the current selection
        var delayData = FlightDelayService.queryFlightDelays(vm.selected, vm.flightDelayData.data)
            // set delay chart properties
        var arrivalData = getArrivalDelayHistogramData(delayData.delayTimeData, chartOptions.arrivalDelayTime)
        vm.chartData.arrivalDelaytime = arrivalData.chartData
        chartOptions.arrivalDelayTime.max = arrivalData.max // set chart max y axis option

        vm.histogramOptions.arrivalDelayTime = FlightDelayChartService.getHistogramOptions(chartOptions.arrivalDelayTime)

        var averageDelayRatio = delayData.averageDelayRatio
        var maxDelayRatio = delayData.maxDelayRatio
        chartOptions.arrivalDelayRatio.drawLine.value = averageDelayRatio // set the value of the average delay ratio
            // set interval here based on maxDelayRatio
            // maxDelayRatio/bins
        var delayRatioChartInterval = maxDelayRatio ? maxDelayRatio / chartOptions.arrivalDelayRatio.bins : 10
        chartOptions.arrivalDelayRatio.intervals = delayRatioChartInterval
            // prebind intervals into xAxis formatter
        chartOptions.arrivalDelayRatio.xAxisFormat = preBind(chartOptions.arrivalDelayRatio.intervals)

            // set delay ratio chart properties
        var delayRatioData = getArrivalDelayHistogramData(delayData.delayRatioData, chartOptions.arrivalDelayRatio)
        vm.chartData.arrivalDelayRatio = delayRatioData.chartData
        chartOptions.arrivalDelayRatio.max = delayRatioData.max
        vm.histogramOptions.arrivalDelayRatio = FlightDelayChartService.getHistogramOptions(chartOptions.arrivalDelayRatio)
      }, 2000)
    }

        /**
         * Get the required histogram data. called by both histogram charts
         * @param {Object} data- Chart data.
         * @param {Object}  options-  options.
         * @returns {Object} = Object with  Chart Data and max y axis value.
         */
    function getArrivalDelayHistogramData (data, options) {
      var range = [0, options.bins * options.intervals] // range on the xaxis
      var binData = d3.layout.histogram().bins(options.bins).range(range)(data)
      var chartData = { bar: true, values: [] }
      var localMaxY = 0
      binData.forEach(function (item) {
        if (localMaxY < item.y) {
          localMaxY = item.y
        }
        chartData.values.push([item.x, item.y])
      })
      return { chartData: [chartData], max: localMaxY }
    }
  }
})()
