!function(){"use strict";function a(a,t){t.latencyThreshold=100,t.includeSpinner=!1,a.otherwise("/flight-delays")}angular.module("App",["ui.bootstrap","ui.router","LocalForageModule","ui.select","ngSanitize","nvd3","angular-loading-bar","ngAnimate"]).config(a).constant("WEEK_DAYS",[{id:0,name:"Sunday"},{id:1,name:"Monday"},{id:2,name:"Tuesday"},{id:3,name:"Wednesday"},{id:4,name:"Thursday"},{id:5,name:"Friday"},{id:6,name:"Saturday"}]),a.$inject=["$urlRouterProvider","cfpLoadingBarProvider"]}(),function(){"use strict";function a(){function a(){e.isNavbarCollapsed=!e.isNavbarCollapsed}function t(){e.isNavbarCollapsed=!0}var e=this;e.isNavbarCollapsed=!0,e.toggleNavbar=a,e.collapseNavbar=t}angular.module("App").controller("NavbarController",a),a.$inject=[]}(),function(){"use strict";function a(a){a.state("flight-delays",{parent:"app",url:"/flight-delays",views:{"content@":{templateUrl:"app/flight-delays/flight-delays.html",controller:"FlightDelaysController",controllerAs:"vm"}}}),a.state("analysis",{parent:"app",url:"/analysis",views:{"content@":{templateUrl:"app/flight-delays/analysis/analysis.html",controller:"FlightDelaysAnalysisController",controllerAs:"vm"}}})}angular.module("App").config(a),a.$inject=["$stateProvider"]}(),function(){"use strict";function a(a,t,e,i,n){function r(a,t){var e=t.data;return e.split("\n").slice(a).filter(function(a){return a})}function l(a,t){function i(a){var t=a.match(/.{1,2}/g).map(Number),e=t[0],i=t[1];return e?60*e+i:i}function n(a){return a.replace(/"/g,"")}function r(a,t){return a/t*100}return a=a||",",t.map(function(t){var l=t.split(a),s=new Date(l[e.FLIGHT_DATE_COL]),o=s.getDay(),c=Number(l[e.DISTANCE_COL]),d=l[e.DEP_TIME_COL];d=n(d);var u=i(d),v=l[e.ARR_TIME_COL];v=n(v);var p=i(v),h=Number(l[e.ELAPSED_TIME_COL]),y=Number(l[e.ARR_DELAY_COL]),m=y>0,g=m?r(y,h):0,f=String(l[e.ORIGIN_COL]);f=n(f);var D=String(l[e.DEST_COL]);return D=n(D),{flightDate:s,day:o,origin:f,destination:D,departureTime:d,departureTimeMin:u,arrivalTime:v,arrivalTimeMin:p,arrivalDelay:y,elapsedTime:h,distance:c,delayed:m,delayRatio:g}})}function s(a){var t={};a.forEach(function(a){t[a.origin]||(t[a.origin]=!0),t[a.destination]||(t[a.destination]=!0)});var e=Object.keys(t);return{data:a,airports:e}}function o(){return h?i.when(h):n.getItem("flightData").then(function(a){return a?(h=a,i.when(h)):i.reject(new Error("data not found"))})}function c(){return a.get(t).then(r.bind(null,e.START_INDEX)).then(l.bind(null,e.SEPERATOR)).then(s).then(d)["catch"](i.reject)}function d(a){return n.setItem("flightData",a).then(function(a){return h=a})}function u(a,t){var e=[],i=[],n=0,r=0;t.filter(function(t){return t.delayed&&t.day===a.day.id&&t.destination===a.destination&&t.origin===a.origin}).forEach(function(a){e.push(a.departureTimeMin),i.push(a.delayRatio),n+=a.delayRatio,a.delayRatio>r&&(r=a.delayRatio)});var l=i.length?Math.round(n/i.length*100)/100:0;return r=Math.round(r),{delayTimeData:e,delayRatioData:i,averageDelayRatio:l,maxDelayRatio:r}}function v(){return o()["catch"](c)}function p(a,t){var e=[],i=[];return t.filter(function(t){return t.delayed&&t.day===a.day.id&&t.origin===a.origin}).forEach(function(a){e.push(a.arrivalDelay),i.push(a.distance)}),{delays:e,distances:i}}var h;return{getFlightDelayData:v,queryFlightDelays:u,getDelaysByDistance:p}}angular.module("App").factory("FlightDelayService",a),a.$inject=["$http","DATA_URL","DATA_INFO","$q","$localForage"]}(),function(){"use strict";function a(a,t,e,i,n,r){function l(a){return function(t){return Math.round(t*a)}}function s(a,t){var e=[0,t.bins*t.intervals],i=d3.layout.histogram().bins(t.bins).range(e)(a),n={bar:!0,values:[]},r=0;return i.forEach(function(a){r<a.y&&(r=a.y),n.values.push([a.x,a.y])}),{chartData:[n],max:r}}var o=this;o.flightDelayData=n,o.selected={day:"",origin:"",destination:""},o.weekDays=t;var c={arrivalDelayTime:{bins:24,max:0,intervals:60,xAxis:"Hour of the day (departure time)",yAxis:"Frequency of arrival delays"},arrivalDelayRatio:{xAxisFormat:null,bins:10,max:0,intervals:10,xAxis:"Delay ratio in %",yAxis:"Frequency of arrival delay  ratio",drawLine:{value:0,text:"Average(%) is ",chartId:"ratios"}}};o.chartData={},o.histogramOptions={},o.enableSearch=function(){return Object.keys(o.selected).every(function(a){return o.selected[a]})},o.search=function(){r.start(),a(function(){r.complete();var a=e.queryFlightDelays(o.selected,o.flightDelayData.data),t=s(a.delayTimeData,c.arrivalDelayTime);o.chartData.arrivalDelaytime=t.chartData,c.arrivalDelayTime.max=t.max,o.histogramOptions.arrivalDelayTime=i.getHistogramOptions(c.arrivalDelayTime);var n=a.averageDelayRatio,d=a.maxDelayRatio;c.arrivalDelayRatio.drawLine.value=n;var u=d?d/c.arrivalDelayRatio.bins:10;c.arrivalDelayRatio.intervals=u,c.arrivalDelayRatio.xAxisFormat=l(c.arrivalDelayRatio.intervals);var v=s(a.delayRatioData,c.arrivalDelayRatio);o.chartData.arrivalDelayRatio=v.chartData,c.arrivalDelayRatio.max=v.max,o.histogramOptions.arrivalDelayRatio=i.getHistogramOptions(c.arrivalDelayRatio)},2e3)}}angular.module("App").controller("FlightDelaysController",a),a.$inject=["$timeout","WEEK_DAYS","FlightDelayService","FlightDelayChartService","flightDelayData","cfpLoadingBar"]}(),function(){"use strict";function a(){function a(a){function t(){return a.max?[0,a.max]:[0]}var e=t(),i={chart:{type:"historicalBarChart",margin:{top:20,right:20,bottom:65,left:50},useInteractiveGuideline:!1,callback:function(t){if(a.drawLine&&a.drawLine.value){var e=t.xAxis.scale(),i=t.margin(),n=d3.select("#"+a.drawLine.chartId+" svg"),r=t.height(),l=e(a.drawLine.value)/a.intervals;n.append("line").style("stroke","#FF7F0E").style("stroke-width","2.5px").attr("x1",l+i.left).attr("y1",i.top).attr("x2",l+i.left).attr("y2",r-i.bottom),n.append("text").attr("x",l+i.left).attr("y",i.top).text(a.drawLine.text+""+a.drawLine.value)}},height:300,x:function(a,t){return t},y:function(a){return a[1]},showValues:!0,valueFormat:function(a){return d3.format(",.1f")(a)},duration:100,xAxis:{axisLabel:a.xAxis,tickFormat:function(t){var e=a.xAxisFormat;return e&&angular.isFunction(e)?e(t):t},ticks:a.bins},yAxis:{axisLabel:a.yAxis,axisLabelDistance:-10,tickFormat:function(a){return d3.format(",.1f")(a)}},yDomain:e}};return i}function t(a){var t={chart:{type:"scatterChart",height:400,showDistX:!0,showDistY:!0,tooltipContent:function(a){return"<h3>"+a+"</h3>"},duration:100,useInteractiveGuideline:!0,xAxis:{axisLabel:a.xAxis},yAxis:{axisLabel:a.yAxis,tickFormat:function(a){return d3.format(".02f")(a)},axisLabelDistance:-5}}};return t}return{getHistogramOptions:a,getScatterChartOptions:t}}angular.module("App").factory("FlightDelayChartService",a),a.$inject=[]}(),function(){"use strict";function a(a,t,e,i,n,r){function l(a){var t=a.distances,e=a.delays,i=t.map(function(a,t){return{x:a,y:e[t]}});return[{values:i,key:"Arrival delay against distance",strokeWidth:2,classed:"dashed"}]}var s=this;s.chartOptions={xAxis:"Distance in miles",yAxis:"Arrival delay in minutes"},s.analysis={},s.weekDays=t,s.flightDelayData=n,s.selected={day:"",origin:""},s.enableSearch=function(){return Object.keys(s.selected).every(function(a){return s.selected[a]})},s.search=function(){r.start(),a(function(){r.complete();var a=e.getDelaysByDistance(s.selected,s.flightDelayData.data),t=l(a);s.analysis.data=t,s.analysis.options=i.getScatterChartOptions(s.chartOptions)},1e3)}}angular.module("App").controller("FlightDelaysAnalysisController",a),a.$inject=["$timeout","WEEK_DAYS","FlightDelayService","FlightDelayChartService","flightDelayData","cfpLoadingBar"]}(),function(){"use strict";function a(a){a.state("app",{"abstract":!0,views:{"navbar@":{templateUrl:"app/layouts/navbar/navbar.html",controller:"NavbarController",controllerAs:"vm"}},resolve:{flightDelayData:["FlightDelayService",function(a){return a.getFlightDelayData()}]}})}angular.module("App").config(a),a.$inject=["$stateProvider"]}(),function(){"use strict";angular.module("App").constant("DEBUG_INFO_ENABLED",!1).constant("DATA_URL","/RIATest/content/data.csv").constant("DATA_INFO",{START_INDEX:1,SEPERATOR:",",FLIGHT_DATE_COL:0,ORIGIN_COL:1,DEST_COL:2,DEP_TIME_COL:3,ARR_TIME_COL:4,ARR_DELAY_COL:5,ELAPSED_TIME_COL:6,DISTANCE_COL:7})}(),function(){angular.module("App").run(["$templateCache",function(a){a.put("app/flight-delays/flight-delays.html",'<div><div class="row search-box"><div class="col-md-3"><ui-select ng-model="vm.selected.day" title="Week day" theme="bootstrap"><ui-select-match placeholder="Choose a week day"><span ng-bind="vm.selected.day.name"></span></ui-select-match><ui-select-choices repeat="day in (vm.weekDays | filter: $select.search) track by day.id" position="down"><span ng-bind="day.name"></span></ui-select-choices></ui-select></div><div class="col-md-3"><ui-select ng-model="vm.selected.origin" title="Origin airport"><ui-select-match placeholder="Choose origin airport"><span ng-bind="vm.selected.origin"></span></ui-select-match><ui-select-choices repeat="airport in (vm.flightDelayData.airports | filter: $select.search) track by airport" position="down"><span ng-bind="airport"></span></ui-select-choices></ui-select></div><div class="col-md-3"><ui-select ng-model="vm.selected.destination" title="Destination airport"><ui-select-match placeholder="Choose destination airport"><span ng-bind="vm.selected.destination"></span></ui-select-match><ui-select-choices repeat="airport in (vm.flightDelayData.airports | filter: $select.search) track by airport" position="down"><span ng-bind="airport"></span></ui-select-choices></ui-select></div><div class="col-md-3"><button class="btn btn-primary" ng-click="vm.search()" ng-disabled="!vm.enableSearch()"><span class="glyphicon glyphicon-search"></span> <span>Search</span></button></div></div><div class="vertical-offset-50"></div><div class="row"><div class="col-md-6 col-xm-12" ng-if="vm.histogramOptions.arrivalDelayTime"><div class="chart-box radius-primary"><div class="padded-title"><h4>Arrival delays</h4></div><nvd3 options="vm.histogramOptions.arrivalDelayTime" data="vm.chartData.arrivalDelaytime"></nvd3></div></div><div class="col-md-6 col-xm-12" ng-if="vm.histogramOptions.arrivalDelayRatio"><div class="chart-box radius-primary"><div class="padded-title"><h4>Arrival delay ratio</h4></div><nvd3 id="ratios" options="vm.histogramOptions.arrivalDelayRatio" data="vm.chartData.arrivalDelayRatio"></nvd3></div></div></div></div>'),a.put("app/flight-delays/analysis/analysis.html",'<div><div class="row search-box"><div class="col-md-5"><ui-select ng-model="vm.selected.day" title="Week day" theme="bootstrap"><ui-select-match placeholder="Choose a week day"><span ng-bind="vm.selected.day.name"></span></ui-select-match><ui-select-choices repeat="day in (vm.weekDays | filter: $select.search) track by day.id" position="down"><span ng-bind="day.name"></span></ui-select-choices></ui-select></div><div class="col-md-5"><ui-select ng-model="vm.selected.origin" title="Origin airport"><ui-select-match placeholder="Choose origin airport"><span ng-bind="vm.selected.origin"></span></ui-select-match><ui-select-choices repeat="airport in (vm.flightDelayData.airports | filter: $select.search) track by airport" position="down"><span ng-bind="airport"></span></ui-select-choices></ui-select></div><div class="col-md-2"><button class="btn btn-primary" ng-click="vm.search()" ng-disabled="!vm.enableSearch()"><span class="glyphicon glyphicon-search"></span> <span>Search</span></button></div></div><div class="vertical-offset-50"></div><div class="row"><div class="col-md-12 col-xm-12" ng-if="vm.analysis.data"><div class="chart-box radius-primary"><div class="padded-title"><h4>Delay distance scatter chart analysis</h4></div><nvd3 options="vm.analysis.options" data="vm.analysis.data"></nvd3></div></div></div></div>'),a.put("app/layouts/navbar/navbar.html",'<nav class="navbar navbar-default" role="navigation"><div class="container"><div class="navbar-header"><button type="button" class="navbar-toggle" ng-click="vm.toggleNavbar()"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></button> <a class="navbar-brand logo" href="#/" ng-click="vm.collapseNavbar()"><img class="logo-img" src="content/images/logo-4dfc82e141.png"> <span>Flight Delay</span></a></div><div class="navbar-collapse" uib-collapse="vm.isNavbarCollapsed"><ul class="nav navbar-nav navbar-left"><li ui-sref-active="active"><a ui-sref="flight-delays" ng-click="vm.collapseNavbar()"><span class="glyphicon glyphicon-time"></span> <span class="hidden-sm">Arrival delay histograms</span></a></li><li ui-sref-active="active"><a ui-sref="analysis" ng-click="vm.collapseNavbar()"><span class="glyphicon glyphicon-stats"></span> <span class="hidden-sm">Distance delay correlations</span></a></li></ul></div></div></nav>')}])}();
//# sourceMappingURL=app-84b352fe35.js.map
