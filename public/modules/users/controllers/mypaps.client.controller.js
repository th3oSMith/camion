'use strict';

angular.module('users').controller('MypapsController', ['$scope','Authentication','$http',
	function($scope, Authentication, $http) {
        
        $http.get('/users/mypaps').success(function(response) {
                // If successful show success message and clear form
                
                $scope.papsables = {};
                $scope.campaigns = {vrac: {name: 'Sans campagne', description: 'Bon ok, c\' est pas normal'}};

                response.forEach(function(el){
                    if (el.campaign){

                        // On enregistre la campange
                        $scope.campaigns[el.campaign._id] = el.campaign;

                         if ($scope.papsables[el.campaign._id])
                            $scope.papsables[el.campaign._id].push(el);
                        else
                            $scope.papsables[el.campaign._id] = [el];
                    }
                    else{
                        if ($scope.papsables.vrac)
                            $scope.papsables.vrac.push(el);
                        else
                            $scope.papsables.vrac = [el];
                    }
                });
            }).error(function(response) {
                $scope.error = response.message;
            });
	}
]);