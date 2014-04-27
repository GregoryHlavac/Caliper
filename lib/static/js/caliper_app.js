var app = angular.module('caliperApp',
	[
		'ngResource',
		'restangular',
		'caliperApp.services',
		'caliperApp.controllers'
	]);

app.config(function(RestangularProvider) {
	RestangularProvider.setBaseUrl('/api');
});