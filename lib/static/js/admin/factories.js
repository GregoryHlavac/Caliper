angular.module('caliperAdmin.factories', [])
	.factory('AdminAuthentication', ['$rootScope', '$http',
		function($rootScope, $http) {
			return {
				isAuthenticated: function() {
					return $rootScope.currentUser;
				},
				login: function(username, password, callback) {
					var cb = callback || angular.noop;

					$http.post('/admin/auth', {username: username, password: password})
						.success(function(data, status, headers, config) {
							if(status === 200) {
								$rootScope.currentUser = data;

								console.log($rootScope.currentUser);
								return cb();
							}
						})
						.error(function(data, status, headers, config) {
							return cb(data, status);
						});
				},
				session: function(callback) {
					var cb = callback || angular.noop;

					$http.get('/admin/auth')
						.success(function(data, status, headers, config) {
							if(status === 200) {
								$rootScope.currentUser = data;

								console.log($rootScope.currentUser);
								return cb();
							}
						})
						.error(function(data, status, headers, config) {
							return cb(data, status);
						});
				},
				logout: function(callback) {
					var cb = callback || angular.noop;

					$rootScope.currentUser = null;

					$http.delete('/admin/auth')
						.success(function(data, status, headers, config) {
							if(status === 200) {
								return cb();
							}
						})
						.error(function(data, status, headers, config) {
							return cb(data, status);
						});
				}
			};
		}
	]);