angular.module('caliperApp.controllers', []).
	controller('NavigatorCtrl', ['$scope', 'Projects', function($scope, Projects) {
		Projects.query(function(response) {
			$scope.projects = response;
		});
	}]);