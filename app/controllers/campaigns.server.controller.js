'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Campaign = mongoose.model('Campaign'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Campaign already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Campaign
 */
exports.create = function(req, res) {
	var campaign = new Campaign(req.body);
	campaign.user = req.user;

	campaign.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(campaign);
		}
	});
};

/**
 * Show the current Campaign
 */
exports.read = function(req, res) {
	res.jsonp(req.campaign);
};

/**
 * Update a Campaign
 */
exports.update = function(req, res) {
	var campaign = req.campaign;

	campaign = _.extend(campaign, req.body);

	campaign.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(campaign);
		}
	});
};

/**
 * Delete an Campaign
 */
exports.delete = function(req, res) {
	var campaign = req.campaign;

	campaign.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(campaign);
		}
	});
};

/**
 * List of Campaigns
 */
exports.list = function(req, res) {
	Campaign.find().sort('-created').populate('user', 'displayName').exec(function(err, campaigns) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(campaigns);
		}
	});
};

/**
 * Campaign middleware
 */
exports.campaignByID = function(req, res, next, id) {
	Campaign.findById(id).populate('user', 'displayName').populate('papsables.object').exec(function(err, campaign) {
		if (err) return next(err);
		if (!campaign) return next(new Error('Failed to load Campaign ' + id));
		req.campaign = campaign;
		next();
	});
};

/**
 * Campaign authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.campaign.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};