'use strict';

angular.module('caliperAdmin',
	[
		'restangular',
		'ui.router',
		'caliperAdmin.factories',
		'caliperAdmin.controllers.login',
		'fineUploaderDirective'
	])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/');

			$stateProvider
				.state('overview', {
					url: '/',
					templateUrl: 'partials/admin/overview.html',
					authenticate: true
				})
				.state('projects', {
					url: '/projects',
					templateUrl: 'partials/admin/projects.html',
					authenticate: true

				})
				.state('users', {
					url: '/users',
					templateUrl: 'partials/admin/users.html',
					authenticate: true
				})
				.state('symbol_upload', {
					url: '/symbol_upload',
					templateUrl: 'partials/admin/symbol_upload.html',
					authenticate: true
				})
				.state('login', {
					url: '/login',
					templateUrl: 'partials/admin/login.html',
					controller: 'LoginController',
					authenticate: false
				});
		}
	])
	.run(['$rootScope', '$state', '$stateParams', 'AdminAuthentication', '$location',
		function($rootScope, $state, $stateParams, AdminAuthentication, $location) {
			$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

				/**
				 *  If you're trying to reach a page that you need to be authenticated to reach.
				 *  If not authenticated we try and grab a session from an existing cookie to
				 *  re-instantiate our already open connection and jump back into the session.
				**/
				if(toState.authenticate && !AdminAuthentication.isAuthenticated()) {
					AdminAuthentication.session(function(err) {
						if(err) {
							$state.go('login');
							event.preventDefault();

							if(toState) {
								$rootScope.afterLoginState = toState;
								$rootScope.afterLoginParams = toParams;
							}
						}
					});

					return;
				}

			});
		}
	]);