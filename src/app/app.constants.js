(function () {
  'use strict'
    // DO NOT EDIT THIS FILE, EDIT THE GULP TASK NGCONSTANT SETTINGS INSTEAD WHICH GENERATES THIS FILE
    angular
        .module('App')
        .constant('DEBUG_INFO_ENABLED', true)
        .constant('DATA_URL', "/content/data.csv")
        .constant('DATA_INFO', {
	"START_INDEX": 1,
	"SEPERATOR": ",",
	"FLIGHT_DATE_COL": 0,
	"ORIGIN_COL": 1,
	"DEST_COL": 2,
	"DEP_TIME_COL": 3,
	"ARR_TIME_COL": 4,
	"ARR_DELAY_COL": 5,
	"ELAPSED_TIME_COL": 6,
	"DISTANCE_COL": 7
})
;
})();
