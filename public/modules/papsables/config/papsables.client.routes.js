'use strict';

//Setting up route
angular.module('papsables').config(['$stateProvider',
	function($stateProvider) {
		// Papsables state routing
		$stateProvider.
		state('listPapsables', {
			url: '/papsables',
			templateUrl: 'modules/papsables/views/list-papsables.client.view.html'
		}).
		state('createPapsable', {
			url: '/papsables/create',
			templateUrl: 'modules/papsables/views/create-papsable.client.view.html'
		}).
		state('viewPapsable', {
			url: '/papsables/:papsableId',
			templateUrl: 'modules/papsables/views/view-papsable.client.view.html'
		}).
		state('editPapsable', {
			url: '/papsables/:papsableId/edit',
			templateUrl: 'modules/papsables/views/edit-papsable.client.view.html'
		});
	}
]);