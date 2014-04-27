angular.module('caliperApp.controllers.report', ['restangular'])
	.controller('ReportController', ['$scope', '$routeParams', 'Restangular',
		function($scope, $routeParams, Restangular) {
			$scope.project_title = $routeParams.projectName;
			$scope.release_version = $routeParams.releaseVersion;
			$scope.crash_id = $routeParams.crashID;
			$scope.report_uuid = $routeParams.reportUUID;

			Restangular.one('crashes', $scope.crash_id)
				.get()
				.then(function(crash) {
					$scope.crash = crash;

					Restangular.one('reports', $scope.report_uuid)
						.get()
						.then(function(report) {
							$scope.report = report;

							report.all('stackframes')
								.getList({ order: '+frame'})
								.then(function(frames) {
									$scope.frames = frames;
								})
						})
				})
		}
	]
);