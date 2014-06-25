'use strict';

//Setting up route
angular.module('administration').config(['$stateProvider',
	function($stateProvider) {
		// Administration state routing
		$stateProvider.
		state('admin', {
			url: '/admin',
			templateUrl: 'modules/administration/views/admin.client.view.html'
		});
	}
]);