'use strict';

// Campaigns controller
angular.module('campaigns').controller('CampaignsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Campaigns', 'Papsables','Time','$interval',
    function($scope, $stateParams, $location, Authentication, Campaigns, Papsables, Time, $interval) {
        $scope.authentication = Authentication;
        $scope.hideCalendar = true;
        $scope.slots = {};
        $scope.countdown = 0;
        $scope.updateCountdown = null;
        $scope.papsables = {};

        // Create new Campaign
        $scope.create = function() {
            // Create new Campaign object
            
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

        // Find PAPS and init countdown
        $scope.papsOne = function (){
            $scope.campaign = Campaigns.get({
                campaignId: $stateParams.campaignId
            });

            $scope.campaign.$promise.then(function(){

                Time.getTime().then(function (result){
                    var time = result.data.time;
                    var start = (new Date($scope.campaign.start)).getTime();

                    $scope.countdown  = Math.floor((start - time)/1000);

                    $scope.updateCountdown = $interval(function(){
                            $scope.countdown--;
                    }, 1000);

                    $scope.campaign.papsables.forEach(function(el){

                        if (!$scope.papsables[el.object._id])
                            $scope.papsables[el.object._id] = el.object;

                    });
                    console.log($scope.papsables);

                });
            });
        };

        $scope.onTimeSet = function(){
            $scope.hideCalendar = true;
        };

        $scope.findPapsables = function(){
            $scope.papsables = Papsables.query();
            $scope.campaignPapsables = [];

            $scope.papsables.$promise.then(function(){

                $scope.papsables.forEach(function(el){
                    $scope.slots[el._id] = el.slots;
                });
            });
        };

        $scope.n = function (number){
            return (number <= 9 ? '0' : '') + number;
        };

        $scope.formatDate = function (seconds) {

        var minutes, hours, days, weeks, output;

        if (seconds <0 )
            return 'PAPS fini';

        output = '';

        minutes = Math.floor(seconds/60);
        seconds %= 60;

        if (seconds || minutes)
            output =$scope.n(seconds) + ' secondes ' + output;

        hours = Math.floor(minutes/60);
        minutes %=60;

        if (minutes || hours)
            output = $scope.n(minutes) + ' minutes ' + output;

        days = Math.floor(hours/24);
        hours %=24;

        if (hours || days)
            output = hours + ' heures ' + output;

        weeks = Math.floor(days/7);
        days %=7;

        if (days || weeks)
            output = days + ' jours ' + output;

        if (weeks)
            output = weeks + ' semaines ' + output;

        return output;
    };
    }
]);