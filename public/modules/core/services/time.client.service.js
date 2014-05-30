'use strict';

//Time Service used to get the time from the server
angular.module('core').factory('Time', ['$http', function($http) {
 return {

    getTime: function() {
        return $http.get('/getTime'); 
    }

};
}]);