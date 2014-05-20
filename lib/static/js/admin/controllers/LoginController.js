angular.module('caliperAdmin.controllers.login', ['caliperAdmin.factories'])
	.controller('LoginController', ['$rootScope', '$scope', '$state', 'AdminAuthentication',
		function($rootScope, $scope, $state, AdminAuthentication) {
			$scope.loginForm = {};

			$scope.login = function() {
				AdminAuthentication.login($scope.loginForm.username, $scope.loginForm.password, function(err) {
					if(!err) {
						if($rootScope.afterLoginState)
							$state.go($rootScope.afterLoginState, $rootScope.afterLoginParams)
						else
							$state.go('overview');
					}
				});
			};
		}
	]);