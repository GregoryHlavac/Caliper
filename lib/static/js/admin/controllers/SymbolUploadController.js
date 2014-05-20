angular.module('caliperAdmin.controllers.symbolupload', ['caliperAdmin.factories'])
	.controller('SymbolUploadController', ['$scope', '$interpolate',
		function($scope, $interpolate) {
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