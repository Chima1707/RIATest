(function () {
    'use strict';

    angular
        .module('App')
        .factory('FlightDelayService', FlightDelayService);

    FlightDelayService.$inject = ['$http', 'DATA_URL', 'DATA_INFO', 'moment', '$q', '$localForage'];

    function FlightDelayService($http, DATA_URL, DATA_INFO, moment, $q, $localForage) {

        var flightDelayData;

        function getDataAsArray(res) {
            var data = res.data
            return data.split('\n').slice(DATA_INFO.START_INDEX).filter(function (line) {
                return line
            });
        }

        function convertDataToJson(data) {
            return data.map(function (line) {
                var cols = line.split(',')
                var flightDate = new Date(cols[DATA_INFO.FLIGHT_DATE_COL]);
                var day = flightDate.getDay();


                var distance = Number(cols[DATA_INFO.DISTANCE_COL]);
                var departureTime = cols[DATA_INFO.DEP_TIME_COL];

                departureTime = filterString(departureTime)
                var departureTimeMin = getTimeAsMinuteOfDay(departureTime)

                var arrivalTime = cols[DATA_INFO.ARR_TIME_COL];
                arrivalTime = filterString(arrivalTime)
                var arrivalTimeMin = getTimeAsMinuteOfDay(arrivalTime)

                var elapsedTime = Number(cols[DATA_INFO.ELAPSED_TIME_COL])

                var arrivalDelay = Number(cols[DATA_INFO.ARR_DELAY_COL]);
                var delayed = arrivalDelay > 0
                var delayRatio = delayed ? getDelayRatio(arrivalDelay, elapsedTime) : 0


                var origin = String(cols[DATA_INFO.ORIGIN_COL])
                origin = filterString(origin)

                var destination = String(cols[DATA_INFO.DEST_COL])
                destination = filterString(destination)

                function getTimeAsMinuteOfDay(str) {
                    var arr = str.match(/.{1,2}/g).map(Number);
                    var hour = arr[0]
                    var min = arr[1]
                    return !hour ? min : (hour * 60) + min
                }


                function filterString(str) {
                    return str.replace(/"/g, "")
                }

                function getDelayRatio(arrivalDelay, elapsedTime) {
                    return (arrivalDelay / elapsedTime) * 100;
                }

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

        function addAirPortData(data) {
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

        function getFlightDelayDataLocal() {
            if (flightDelayData) {
                return $q.when(flightDelayData)
            } else {
                return $localForage.getItem('flightData').then(function (data) {
                    if (!data) {
                        return $q.reject(new Error('data not found'))
                    }
                    flightDelayData = data
                    return $q.when(flightDelayData)
                })
            }
        }

        function getFlightDelayDataRemote() {
            return $http.get(DATA_URL)
                .then(getDataAsArray)
                .then(convertDataToJson)
                .then(addAirPortData)
                .then(cacheData)
                .catch($q.reject)
        }

        function cacheData(data) {
            return $localForage.setItem('flightData', data)
                .then(function (res) {
                    flightDelayData = res;
                })
        }

        function queryFlightDelays(query, data) {
            var delayTimeData = []
            var delayRatioData = []
            var totalDelayRatio = 0
            data.filter(function (item) {
                return item.delayed
                    && item.day === query.day.id
                    && item.destination === query.destination
                    && item.origin === query.origin
            })
                .forEach(function (item) {
                    delayTimeData.push(item.departureTimeMin)
                    delayRatioData.push(item.delayRatio)
                    totalDelayRatio += item.delayRatio
                })
            var averageDelayRatio = !delayRatioData.length ? 0 : Math.round((totalDelayRatio / delayRatioData.length) * 100) / 100

            return { delayTimeData: delayTimeData, delayRatioData: delayRatioData, averageDelayRatio: averageDelayRatio };
        }

        function getDelaysByDistance(data) {
            var delays = []
            var distances = []
            data.filter(function (item) {
                return item.delayed
            }).forEach(function (item) {
                delays.push(item.arrivalDelay)
                distances.push(item.distance)
            })
            return { delays: delays, distances: distances }
        }


        return {
            getFlightDelayData: function () {
                return getFlightDelayDataLocal()
                    .catch(getFlightDelayDataRemote)
            },
            queryFlightDelays: queryFlightDelays,
            getDelaysByDistance: getDelaysByDistance
        }
    }
})();