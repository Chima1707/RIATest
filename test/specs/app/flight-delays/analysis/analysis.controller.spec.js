describe('Controller: FlightDelaysAnalysisController', function () {
  beforeEach(module('App'))
  var $timeout
  var FlightDelaysAnalysisController
  var scope
  var flightDelayData = {data: []}
  var FlightDelayService
  var FlightDelayChartService

  beforeEach(inject(function ($controller, $rootScope, _FlightDelayService_, _FlightDelayChartService_, _$timeout_) {
    $timeout = _$timeout_
    scope = $rootScope.$new()
    FlightDelayService = _FlightDelayService_
    FlightDelayChartService = _FlightDelayChartService_
    spyOn(FlightDelayService, 'getDelaysByDistance').and.callFake(function () {
      return { delays: [], distances: [] }
    })
    spyOn(FlightDelayChartService, 'getScatterChartOptions').and.callFake(function () {
      return { chart: {} }
    })
    FlightDelaysAnalysisController = $controller('FlightDelaysAnalysisController as vm', {flightDelayData: flightDelayData, $scope: scope})
  }))

  it('should define FlightDelaysController and have all necessary properties setup', function () {
    expect(FlightDelaysAnalysisController).toBeDefined()
    expect(FlightDelaysAnalysisController.flightDelayData).toBeDefined()
    expect(FlightDelaysAnalysisController.weekDays).toBeDefined()
    expect(FlightDelaysAnalysisController.chartOptions).toBeDefined()
    expect(FlightDelaysAnalysisController.analysis).toBeDefined()
    expect(FlightDelaysAnalysisController.selected).toBeDefined()
  })

  it('should disable search button by default', function () {
    var result = scope.vm.enableSearch()
    expect(result).toBeFalsy()
  })

  it('should enable search button when search form is properly filled', function () {
    scope.vm.selected = { day: { id: 1, name: 'Monday' }, origin: 'SFO' }
    var result = scope.vm.enableSearch()
    expect(result).toBeTruthy()
  })

  it('should query FlightDelayService and draw chart when search button is clicked', function () {
    scope.vm.search()
    $timeout.flush()
    expect(FlightDelayService.getDelaysByDistance).toHaveBeenCalled()
    expect(FlightDelayChartService.getScatterChartOptions.calls.count()).toEqual(1)
  })
})
