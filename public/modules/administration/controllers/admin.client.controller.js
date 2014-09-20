'use strict';

angular.module('administration').controller('AdminController', ['$scope', 'Authentication', 'Useradmin', 'Campaigns',
	function($scope, Authentication, Useradmin, Campaigns) {
		// Controller Logic
		// ...

		$scope.users = [];
        $scope.campaigns = [];

		$scope.getUsers= function (){
			$scope.users = Useradmin.query();
		};

        $scope.getCampaigns = function(){
            $scope.campaigns = Campaigns.query();
        }

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