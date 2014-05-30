'use strict';

// Campaigns controller
angular.module('campaigns').controller('CampaignsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Campaigns', 'Papsables',
    function($scope, $stateParams, $location, Authentication, Campaigns, Papsables) {
        $scope.authentication = Authentication;
        $scope.hideCalendar = true;


        // Create new Campaign
        $scope.create = function() {
            // Create new Campaign object
            
            // Mise en forme des papsables
            var x = 0;
            for (x=0; x<this.campaignPapsables.length; x++)
                this.campaignPapsables[x].object = this.campaignPapsables[x].object._id;
            
            var campaign = new Campaigns({
                name: this.name,
                start: this.start,
                papsables: this.campaignPapsables,
                description: this.description
            });

            // Redirect after save
            campaign.$save(function(response) {
                $location.path('campaigns/' + response._id);
            }, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

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
        };

        $scope.findPapsables = function(){
            $scope.papsables = Papsables.query();
            $scope.campaignPapsables = [];
        };



    }
]);