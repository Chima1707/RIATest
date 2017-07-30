describe('Controller: FlightDelaysController', function () {
  beforeEach(module('App'))

  var FlightDelaysController
  beforeEach(inject(function ($controller, $state, $rootScope) {
    FlightDelaysController = $controller('FlightDelaysController', {flightDelayData: [], $scope: $rootScope.$new()})
  }))

  describe('FlightDelaysController', function () {
    it('should define FlightDelaysController and have all necessary properties setup', function () {
      expect(FlightDelaysController).toBeDefined()
      expect(FlightDelaysController.flightDelayData).toBeDefined()
    })
  })
})
