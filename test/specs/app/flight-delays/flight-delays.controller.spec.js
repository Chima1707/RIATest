describe('Controller: FlightDelaysController', function () {
  beforeEach(module('App'))
  var $timeout
  var FlightDelaysController
  var scope
  var flightDelayData = {data: []}
  var FlightDelayService
  var FlightDelayChartService

  beforeEach(inject(function ($controller, $rootScope, _FlightDelayService_, _FlightDelayChartService_, _$timeout_) {
    $timeout = _$timeout_
    scope = $rootScope.$new()
    FlightDelayService = _FlightDelayService_
    FlightDelayChartService = _FlightDelayChartService_
    spyOn(FlightDelayService, 'queryFlightDelays').and.callFake(function () {
      return { delayTimeData: [], delayRatioData: [], averageDelayRatio: 0, maxDelayRatio: 0 }
    })
    spyOn(FlightDelayChartService, 'getHistogramOptions').and.callFake(function () {
      return { chart: {} }
    })
    FlightDelaysController = $controller('FlightDelaysController as vm', {flightDelayData: flightDelayData, $scope: scope})
  }))

  it('should define FlightDelaysController and have all necessary properties setup', function () {
    expect(FlightDelaysController).toBeDefined()
    expect(FlightDelaysController.flightDelayData).toBeDefined()
    expect(FlightDelaysController.weekDays).toBeDefined()
    expect(FlightDelaysController.chartData).toBeDefined()
    expect(FlightDelaysController.histogramOptions).toBeDefined()
    expect(FlightDelaysController.selected).toBeDefined()
  })

  it('should disable search button by default', function () {
    var result = scope.vm.enableSearch()
    expect(result).toBeFalsy()
  })

  it('should enable search button when search form is properly filled', function () {
    scope.vm.selected = {day: { id: 1, name: 'Monday' }, origin: 'SFO', destination: 'JFK'}
    var result = scope.vm.enableSearch()
    expect(result).toBeTruthy()
  })

  it('should query FlightDelayService and draw charts when search button is clicked', function () {
    scope.vm.search()
    $timeout.flush()
    expect(FlightDelayService.queryFlightDelays).toHaveBeenCalled()
    expect(FlightDelayChartService.getHistogramOptions.calls.count()).toEqual(2)
  })
})
