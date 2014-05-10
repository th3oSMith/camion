'use strict';

//Papsables service used to communicate Papsables REST endpoints
angular.module('papsables').factory('Papsables', ['$resource', function($resource) {
    return $resource('papsables/:papsableId', {
        papsableId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);