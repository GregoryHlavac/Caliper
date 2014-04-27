'use strict';

angular.module('caliperApp',
[
	'ngResource',
	'ngRoute',
	'restangular',
	'chartjs',
	'caliperApp.filters',
	'caliperApp.controllers.navigation',
	'caliperApp.controllers.index',
	'caliperApp.controllers.project',
	'caliperApp.controllers.release',
	'caliperApp.controllers.crash',
	'caliperApp.controllers.report'
])
.config(["RestangularProvider",
		function(RestangularProvider) {
			RestangularProvider.setBaseUrl('/api');
		}
	]
)
.config(['$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider) {
			$routeProvider
				.when('/', {
					templateUrl: 'partials/index.html',
					controller: 'IndexController'
				})
				.when('/project/:projectName', {
					templateUrl: 'partials/project.html',
					controller: 'ProjectController'
				})
				.when('/project/:projectName/:releaseVersion', {
					templateUrl: 'partials/release.html',
					controller: 'ReleaseController'
				})
				.when('/project/:projectName/:releaseVersion/:crashID', {
					templateUrl: 'partials/crash.html',
					controller: 'CrashController'
				})
				.when('/project/:projectName/:releaseVersion/:crashID/:reportUUID', {
					templateUrl: 'partials/report.html',
					controller: 'ReportController'
				})
				.otherwise({
					redirectTo: '/'
				});

			//$locationProvider.html5Mode(true);
		}
	]
);