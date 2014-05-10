'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var papsables = require('../../app/controllers/papsables');

	// Papsables Routes
	app.route('/papsables')
		.get(papsables.list)
		.post(users.requiresLogin, papsables.create);
	
	app.route('/papsables/:papsableId')
		.get(papsables.read)
		.put(users.requiresLogin, papsables.hasAuthorization, papsables.update)
	    .delete(users.requiresLogin, papsables.hasAuthorization, papsables.delete);

	// Finish by binding the Papsable middleware
	app.param('papsableId', papsables.papsableByID);
};