'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var campaigns = require('../../app/controllers/campaigns');

	// Campaigns Routes
	app.route('/campaigns')
		.get(campaigns.list)
		.post(users.requiresLogin, campaigns.create);
	
	app.route('/campaigns/:campaignId')
		.get(campaigns.read)
		.put(users.requiresLogin, campaigns.hasAuthorization, campaigns.update)
	    .delete(users.requiresLogin, campaigns.hasAuthorization, campaigns.delete);

	// Finish by binding the Campaign middleware
	app.param('campaignId', campaigns.campaignByID);
};