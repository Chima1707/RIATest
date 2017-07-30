(function () {
    'use strict';

    angular
        .module('App')
        .controller('FlightDelaysController', FlightDelaysController);

    FlightDelaysController.$inject = ['FlightDelayService', 'FlightDelayChartService', 'flightDelayData'];

    function FlightDelaysController(FlightDelayService, FlightDelayChartService, flightDelayData) {
        var vm = this;
        vm.flightDelayData = flightDelayData
        vm.selected = { day: '', origin: '', destination: '' };

        var chartOptions = {
            arrivalDelayTime: {
                bins: 24, max: 0, intervals: 60,
                xAxis: 'Hour of the day', yAxis: 'Number of arrival delays'
            },
            arrivalDelayRatio: {
                xAxisFormat: function (d) {
                    return d * 10
                },
                bins: 10, max: 0, intervals: 10, xAxis: 'Delay ratio in %', yAxis: 'Frequency',
                drawLine: { value: 0, text: 'Average(%) is ', chartId: 'ratios' }
            }
        }

        vm.chartData = { arrivalDelaytime: [] }
        vm.histogramOptions = { arrivalDelaytime: FlightDelayChartService.getHistogramOptions(chartOptions.arrivalDelayTime) }

        vm.weekDays = [
            { id: 0, name: 'Sunday' },
            { id: 1, name: 'Monday' },
            { id: 2, name: 'Tuesday' },
            { id: 3, name: 'Wednesday' },
            { id: 4, name: 'Thursday' },
            { id: 5, name: 'Friday' },
            { id: 6, name: 'Saturday' }
        ];


        vm.enableSearch = function () {
            return Object.keys(vm.selected).every(function (key) {
                return vm.selected[key]
            })

        }

        vm.search = function () {
            var delayData = FlightDelayService.queryFlightDelays(vm.selected, vm.flightDelayData.data)

            vm.chartData.arrivalDelaytime = getArrivalDelayHistogramData(delayData.delayTimeData, chartOptions.arrivalDelayTime);
            vm.histogramOptions.arrivalDelayTime = FlightDelayChartService.getHistogramOptions(chartOptions.arrivalDelayTime);

            var averageDelayRatio = delayData.averageDelayRatio
            chartOptions.arrivalDelayRatio.drawLine.value = averageDelayRatio
            console.log(averageDelayRatio)

            vm.chartData.arrivalDelayRatio = getArrivalDelayHistogramData(delayData.delayRatioData, chartOptions.arrivalDelayRatio);
            vm.histogramOptions.arrivalDelayRatio = FlightDelayChartService.getHistogramOptions(chartOptions.arrivalDelayRatio)
        }

        function getArrivalDelayHistogramData(data, options) {
            var range = [0, options.bins * options.intervals]
            var binData = d3.layout.histogram().bins(options.bins).range(range)(data);
            var chartData = { key: 'Count', bar: true, values: [] };
            var localMaxY = 0
            binData.forEach(function (item) {
                if (localMaxY < item.y) {
                    localMaxY = item.y
                }
                chartData.values.push([item.x, item.y])
            })
            options.max = localMaxY;
            return [chartData]
        }

    }
})();
