(function () {
  'use strict'

  angular
        .module('App')
        .factory('FlightDelayChartService', FlightDelayChartService)

  FlightDelayChartService.$inject = []

  function FlightDelayChartService () {
        /**
         * Get the options required for a histogram.
         * @param {Object} options- option.
         * @returns {Object} = Chart option.
         */
    function getHistogramOptions (options) {
      function getYDomain () {
        return options.max ? [0, options.max] : [0]
      }

      var yDomain = getYDomain()
      var histogramOptions = {
        chart: {
          type: 'historicalBarChart',
          margin: {
            top: 20,
            right: 20,
            bottom: 65,
            left: 50
          },
          useInteractiveGuideline: false,
          callback: function (chart) {
            if (options.drawLine && options.drawLine.value) {
              var xScale = chart.xAxis.scale()
              var margin = chart.margin()
              var svg = d3.select('#' + options.drawLine.chartId + ' svg')
              var height = chart.height()
              var onXAxis = xScale(options.drawLine.value) / options.intervals
              svg.append('line')
                                .style('stroke', '#FF7F0E')
                                .style('stroke-width', '2.5px')
                                .attr('x1', onXAxis + margin.left)
                                .attr('y1', margin.top)
                                .attr('x2', onXAxis + margin.left)
                                .attr('y2', height - margin.bottom)
              svg.append('text')
                                .attr('x', onXAxis + margin.left)
                                .attr('y', margin.top)
                                .text(options.drawLine.text + '' + options.drawLine.value)
            }
          },
          height: 300,
          x: function (d, i) {
            return i
          },
          y: function (d) {
            return d[1]
          },
          showValues: true,
          valueFormat: function (d) {
            return d3.format(',.1f')(d)
          },
          duration: 100,
          xAxis: {
            axisLabel: options.xAxis,
            tickFormat: function (d) {
              var format = options.xAxisFormat
              return format && angular.isFunction(format) ? format(d) : d
            },
            ticks: options.bins

          },
          yAxis: {
            axisLabel: options.yAxis,
            axisLabelDistance: -10,
            tickFormat: function (d) {
              return d3.format(',.1f')(d)
            }
          },
          yDomain: yDomain
        }
      }
      return histogramOptions
    }

    function getScatterChartOptions (options) {
      var scatterChartOptions = {
        chart: {
          type: 'scatterChart',
          height: 400,

          showDistX: true,
          showDistY: true,
          tooltipContent: function (key) {
            return '<h3>' + key + '</h3>'
          },
          duration: 100,
          useInteractiveGuideline: true,
          xAxis: {
            axisLabel: options.xAxis
          },
          yAxis: {
            axisLabel: options.yAxis,
            tickFormat: function (d) {
              return d3.format('.02f')(d)
            },
            axisLabelDistance: -5
          }
        }
      }
      return scatterChartOptions
    }
    return {
      getHistogramOptions: getHistogramOptions,
      getScatterChartOptions: getScatterChartOptions
    }
  }
})()
