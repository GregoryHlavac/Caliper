angular.module('caliperApp.controllers.release', ['restangular'])
.controller('ReleaseController', ['$scope', '$routeParams', 'Restangular',
		function($scope, $routeParams, Restangular) {
			Restangular.one('projects', $routeParams.projectName).get().then(
				function(project) {
					$scope.project = project;

					project.one('releases', $routeParams.releaseVersion).get()
						.then(function(release) {
							$scope.release = release;

							release.all('crashes').getList()
								.then(function(crashes) {
									$scope.crashes = crashes;
								})
						});
				}
			);
		}
	]
);