var caliServices = angular.module('caliperApp.services', ['ngResource']);

caliServices.factory('Projects', function($resource){
	return $resource('/api/projects.json');
});

caliServices.factory('Releases', function($resources){
	return $resource('/api/releases.json');
})