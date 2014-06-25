'use strict';

angular.module('administration').factory('Useradmin', [ '$resource', function($resource) {
		return $resource('admin/users/:userId', {
			userId: '@_id' }, {
		});
	}
]);