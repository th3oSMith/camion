'use strict';

angular.module('administration').controller('AdminController', ['$scope', 'Authentication', 'Useradmin',
	function($scope, Authentication, Useradmin) {
		// Controller Logic
		// ...

		$scope.users = [];

		$scope.getUsers= function (){
			$scope.users = Useradmin.query();
		};

        $scope.isAdmin = function(user) {
           return user.roles.indexOf('admin') !== -1;
        };

        $scope.changeAdmin = function(user) {
            Useradmin.changeAdmin({userId: user._id}, function(response){
                user.roles = response.roles;
            }, function(data) {
                console.log(data);
            });
        };
	}
]);