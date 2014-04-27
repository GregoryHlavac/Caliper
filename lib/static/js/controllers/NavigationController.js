angular.module('caliperApp.controllers.navigation', ['restangular'])
.controller('NavigationController', ['$scope', 'Restangular', function($scope, Restangular) {
	Restangular.all('projects').getList({ order: '+id'})
		.then(function(projects) {
			$scope.projects = projects;
		});
}]);