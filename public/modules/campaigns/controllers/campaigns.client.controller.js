'use strict';

// Campaigns controller
angular.module('campaigns').controller('CampaignsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Campaigns',
    function($scope, $stateParams, $location, Authentication, Campaigns) {
        $scope.authentication = Authentication;

        // Create new Campaign
        $scope.create = function() {
        	// Create new Campaign object
            var campaign = new Campaigns({
                name: this.name,
                start: this.start
            });

            // Redirect after save
            campaign.$save(function(response) {
                $location.path('campaigns/' + response._id);
            }, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

            // Clear form fields
            this.name = '';
        };

        // Remove existing Campaign
        $scope.remove = function(campaign) {
            if (campaign) {
                campaign.$remove();

                for (var i in $scope.campaigns) {
                    if ($scope.campaigns[i] === campaign) {
                        $scope.campaigns.splice(i, 1);
                    }
                }
            } else {
                $scope.campaign.$remove(function() {
                    $location.path('campaigns');
                });
            }
        };

        // Update existing Campaign
        $scope.update = function() {
            var campaign = $scope.campaign;

            campaign.$update(function() {
                $location.path('campaigns/' + campaign._id);
            }, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
        };

        // Find a list of Campaigns
        $scope.find = function() {
            $scope.campaigns = Campaigns.query();
        };

        // Find existing Campaign
        $scope.findOne = function() {
            $scope.campaign = Campaigns.get({
                campaignId: $stateParams.campaignId
            });
        };

        $scope.onTimeSet = function(){
            $scope.hideCalendar = true;
        }
    }
]);