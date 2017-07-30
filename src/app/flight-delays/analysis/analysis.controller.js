(function () {
    'use strict';

    angular
        .module('App')
        .controller('FlightDelaysAnalysisController', FlightDelaysAnalysisController);

    FlightDelaysAnalysisController.$inject = ['FlightDelayService', 'FlightDelayChartService', 'flightDelayData'];

    function FlightDelaysAnalysisController(FlightDelayService, FlightDelayChartService, flightDelayData) {
        var vm = this;
        vm.chartOptions = { xAxis: 'Distance in miles', yAxis: 'Arrival delay in minutes' }
        vm.analysis = {}


        function init() {
            var data = FlightDelayService.getDelaysByDistance(flightDelayData.data)
            var chartData = getAnalysisData(data)
            vm.analysis.data = chartData
            vm.analysis.options = FlightDelayChartService.getLineChartOptions(vm.chartOptions)
        }

        function getAnalysisData(data) {
            var distances = data.distances
            var delays = data.delays
            var values = distances.map(function (distance, index) {
                return { x: distance, y: delays[index] }
            })

            return [{
                values: values, key: 'distance/arrival delay',
                strokeWidth: 2,
                classed: 'dashed'
            }]
        }

        init()
    }
})();
