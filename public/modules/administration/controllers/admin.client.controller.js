'use strict';

angular.module('administration').controller('AdminController', ['$scope', 'Authentication', 'Useradmin',
	function($scope, Authentication, Useradmin) {
		// Controller Logic
		// ...

		$scope.users = [];

		$scope.getUsers= function (){
			$scope.users = Useradmin.query();
		};
	}
]);