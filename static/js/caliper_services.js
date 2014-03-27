angular.module('caliperApp.services', ['ngResource'])
	.factory('Projects', function($resource){
		return $resource('/api/projects.json');
	});

