(function () {
  'use strict'

  angular
        .module('App')
        .factory('FlightDelayService', FlightDelayService)

  FlightDelayService.$inject = ['$http', 'DATA_URL', 'DATA_INFO', '$q', '$localForage']

  function FlightDelayService ($http, DATA_URL, DATA_INFO, $q, $localForage) {
    var flightDelayData

        /**
         * Split csv file contents into array of strings starting from a specifed index.
         * @param {Number} row - row to start slice from.
         * @param {String} res - Multiine string representing csv file contents.
         * @returns {Array} = Array of strings, each line representing an row in the file.
         */
    function getDataAsArray (row, res) {
      var data = res.data
      return data.split('\n').slice(row).filter(function (line) {
        return line
      })
    }

        /**
         * Converts an array of strings into array of objects.
         * @param {Array} data- Array of strings.
         * @param {String} separator - split strings by.
         * @returns {Array} = Array of objects.
         */
    function convertDataToJson (seperator, data) {
      seperator = seperator || ','

      function getTimeAsMinuteOfDay (str) {
                // get minutes of the day, 12:00 => 720 minute of the day
        var arr = str.match(/.{1,2}/g).map(Number)
        var hour = arr[0]
        var min = arr[1]
        return !hour ? min : (hour * 60) + min
      }

      function filterString (str) {
        return str.replace(/"/g, '')
      }

      function getDelayRatio (arrivalDelay, elapsedTime) {
                // delay ratio is arrival delay in minutes / flight elapsed time in minutes
        return (arrivalDelay / elapsedTime) * 100
      }
            // map through all the array entries, converting each entry to a corresponding object.
      return data.map(function (line) {
        var cols = line.split(seperator)
        var flightDate = new Date(cols[DATA_INFO.FLIGHT_DATE_COL])
        var day = flightDate.getDay()

        var distance = Number(cols[DATA_INFO.DISTANCE_COL])
        var departureTime = cols[DATA_INFO.DEP_TIME_COL]

        departureTime = filterString(departureTime)
        var departureTimeMin = getTimeAsMinuteOfDay(departureTime)

        var arrivalTime = cols[DATA_INFO.ARR_TIME_COL]
        arrivalTime = filterString(arrivalTime)
        var arrivalTimeMin = getTimeAsMinuteOfDay(arrivalTime)

        var elapsedTime = Number(cols[DATA_INFO.ELAPSED_TIME_COL])

        var arrivalDelay = Number(cols[DATA_INFO.ARR_DELAY_COL])
        var delayed = arrivalDelay > 0   // if its an arrival delay the precalculate its delayRatio
        var delayRatio = delayed ? getDelayRatio(arrivalDelay, elapsedTime) : 0

        var origin = String(cols[DATA_INFO.ORIGIN_COL])
        origin = filterString(origin)

        var destination = String(cols[DATA_INFO.DEST_COL])
        destination = filterString(destination)

        return {
          flightDate: flightDate,
          day: day,
          origin: origin,
          destination: destination,
          departureTime: departureTime,
          departureTimeMin: departureTimeMin,
          arrivalTime: arrivalTime,
          arrivalTimeMin: arrivalTimeMin,
          arrivalDelay: arrivalDelay,
          elapsedTime: elapsedTime,
          distance: distance,
          delayed: delayed,
          delayRatio: delayRatio
        }
      })
    }

        /**
         * Enrich data with airport name list.
         * @param {Array} data- Array of flight schedule objects.
         * @returns {Object} = Object composed of array flight schedule and airport name list.
         */
    function addAirPortData (data) {
      var res = {}
      data.forEach(function (item) {
        if (!res[item.origin]) {
          res[item.origin] = true
        }
        if (!res[item.destination]) {
          res[item.destination] = true
        }
      })
      var airports = Object.keys(res)
      return { data: data, airports: airports }
    }

        /**
         * Called to get flight delay data from memory or from local database.
         * @returns {Promise} = Promise will resolve to flight delay data or reject when not found locally.
         */
    function getFlightDelayDataLocal () {
      if (flightDelayData) { // if data exists as private variable resolve with it
        return $q.when(flightDelayData)
      } else {
        return $localForage.getItem('flightData').then(function (data) {
          if (!data) {  // if not found in local forage, reject with an error
            return $q.reject(new Error('data not found'))
          }
          flightDelayData = data  // Set data in private variable and resolve with it
          return $q.when(flightDelayData)
        })
      }
    }

        /**
         * Called to get data from remote when data does not exists locally.
         * @returns {Promise} = Promise will resolve with data or reject with error.
         */
    function getFlightDelayDataRemote () {
      return $http.get(DATA_URL)
                .then(getDataAsArray.bind(null, DATA_INFO.START_INDEX))
                .then(convertDataToJson.bind(null, DATA_INFO.SEPERATOR))
                .then(addAirPortData)
                .then(cacheData)
                .catch($q.reject)
    }

        /**
         * Caches data locally in local database and in a private variable.
         * @returns {Promise} = Promise will resolves with data, or rejects with error.
         */
    function cacheData (data) {
      return $localForage.setItem('flightData', data)
                .then(function (res) {
                  flightDelayData = res // store in instance variable
                  return flightDelayData
                })
    }

        /**
         * Queries for flight delays.
         * @param {Object} query - Represents selected data points, day, origin and destination.
         * @param {String} data - Flight delays data.
         * @returns {Object} = Object representing delay  data, delay ratio data, average delay ratio, max delay ratio.
         */
    function queryFlightDelays (query, data) {
      var delayTimeData = []
      var delayRatioData = []
      var totalDelayRatio = 0
      var maxDelayRatio = 0
      data.filter(function (item) { // if delayed and it matches query parameters
        return item.delayed &&
                    item.day === query.day.id &&
                    item.destination === query.destination &&
                    item.origin === query.origin
      })
                .forEach(function (item) {
                  delayTimeData.push(item.departureTimeMin) // add time the flight departed to its list
                  delayRatioData.push(item.delayRatio) // add delay ratio(precalculated) to its list
                  totalDelayRatio += item.delayRatio   // add to total delay ratio used for calculating average delay ratio
                  if (item.delayRatio > maxDelayRatio) { // keep track of the max delay ratio, used for ploting histogram
                    maxDelayRatio = item.delayRatio
                  }
                })
            // get average delay ratio
      var averageDelayRatio = !delayRatioData.length ? 0 : Math.round((totalDelayRatio / delayRatioData.length) * 100) / 100
      maxDelayRatio = Math.round(maxDelayRatio)
      return { delayTimeData: delayTimeData, delayRatioData: delayRatioData, averageDelayRatio: averageDelayRatio, maxDelayRatio: maxDelayRatio }
    }

        /**
         * Called to get data, check data locally first, if not found check remotely.
         * @returns {Promise} = Promise resolves with data or reject.
         */
    function getFlightDelayData () {
      return getFlightDelayDataLocal()
                .catch(getFlightDelayDataRemote)
    }

        /**
         * Queries for flight delays.
         * @param {Object} query - Represents selected data points, day, origin.
         * @param {String} data - Flight delays data.
         * @returns {Object} = Object representing list of delays and corresponding list of distance.
         */
    function getDelaysByDistance (query, data) {
      var delays = []
      var distances = []
      data.filter(function (item) {
        return item.delayed && item.day === query.day.id && item.origin === query.origin
      }).forEach(function (item) {
        delays.push(item.arrivalDelay)
        distances.push(item.distance)
      })
      return { delays: delays, distances: distances }
    }

    function validateQuery (query) {
      return Object.keys(query).every(function (key) {
        return query[key]
      })
    }

    return {
      getFlightDelayData: getFlightDelayData,
      queryFlightDelays: queryFlightDelays,
      getDelaysByDistance: getDelaysByDistance,
      validateQuery: validateQuery
    }
  }
})()
