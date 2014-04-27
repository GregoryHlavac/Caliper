angular.module('caliperApp.controllers.crash', ['restangular'])
	.controller('CrashController', ['$scope', '$routeParams', '$location', 'Restangular',
		function($scope, $routeParams, $location, Restangular) {
			$scope.project_title = $routeParams.projectName;
			$scope.release_version = $routeParams.releaseVersion;
			$scope.crash_id = $routeParams.crashID;

			Restangular.one('crashes', $routeParams.crashID).get()
				.then(function(crs) {
					$scope.crash = crs;

					crs.all('reports')
						.getList({ order: '-reported_on' })
						.then(function(reports) {
							$scope.reports = reports;
						});
				});

			$scope.viewReport = function(rpt) {
				$location.path('/project/' +
					$scope.project_title + '/' +
					$scope.release_version + '/' +
					$scope.crash_id + '/' +
					rpt.report_uuid);
			}
		}
	]
);