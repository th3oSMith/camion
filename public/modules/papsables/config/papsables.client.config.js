'use strict';

// Configuring the Articles module
angular.module('papsables').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Papsables', 'papsables');
		Menus.addMenuItem('topbar', 'New Papsable', 'papsables/create');
	}
]);