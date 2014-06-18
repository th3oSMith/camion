'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Campaigns', '$interval', 'Time', function ($scope, Authentication, Campaigns, $interval, Time) {
    $scope.authentication = Authentication;
    $scope.countdowns = {};
    $scope.updateCountdowns = null;
    $scope.serverDate = 0;

    $scope.test = 2;

    $scope.findFutureCampaigns = function() {
         $scope.campaigns = Campaigns.query({future: true}, function(){
            
            Time.getTime().then(function (result){
                var time = result.data.time;
                // On initialise les comptes à rebout
                $scope.campaigns.forEach(function(el){
                    var start = (new Date(el.start)).getTime();
                    $scope.countdowns[el._id]  = Math.floor((start - time)/1000);
                });

                $scope.updateCountdowns = $interval(function(){
                    for (var key in $scope.countdowns)
                        $scope.countdowns[key]--;
                }, 1000);
            });

         });
        
    };

    $scope.n = function (number){
        return (number <= 9 ? '0' : '') + number;
    };

    $scope.formatDate = function (seconds) {

        var minutes, hours, days, weeks, output;

        if (seconds <0 )
            return 'PAPS en cours';

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

}]);
