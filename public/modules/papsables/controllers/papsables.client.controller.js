'use strict';

// Papsables controller
angular.module('papsables').controller('PapsablesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Papsables',
    function($scope, $stateParams, $location, Authentication, Papsables) {
        $scope.authentication = Authentication;

        // Create new Papsable
        $scope.create = function() {
        	// Create new Papsable object
            var papsable = new Papsables({
                name: this.name,
                properties: this.properties,
                amount: this.amount
            });

            console.log(this.properties);

            // Redirect after save
            papsable.$save(function(response) {
                $location.path('papsables/' + response._id);
            }, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

        };

        // Remove existing Papsable
        $scope.remove = function(papsable) {
            if (papsable) {
                papsable.$remove();

                for (var i in $scope.papsables) {
                    if ($scope.papsables[i] === papsable) {
                        $scope.papsables.splice(i, 1);
                    }
                }
            } else {
                $scope.papsable.$remove(function() {
                    $location.path('papsables');
                });
            }
        };

        // Update existing Papsable
        $scope.update = function() {
            var papsable = $scope.papsable;

            papsable.$update(function() {
                $location.path('papsables/' + papsable._id);
            }, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
        };

        // Find a list of Papsables
        $scope.find = function() {
            $scope.papsables = Papsables.query();
        };

        // Find existing Papsable
        $scope.findOne = function() {
            $scope.papsable = Papsables.get({
                papsableId: $stateParams.papsableId
            });
        };

        $scope.initProperties = function(){
            $scope.properties = [];
        };
    }
]);