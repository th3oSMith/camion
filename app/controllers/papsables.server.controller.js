'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Papsable = mongoose.model('Papsable'),
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
				message = 'Papsable already exists';
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
 * Create a Papsable
 */
exports.create = function(req, res) {
	var papsable = new Papsable(req.body);
	papsable.user = req.user;

	papsable.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(papsable);
		}
	});
};

/**
 * Show the current Papsable
 */
exports.read = function(req, res) {
	res.jsonp(req.papsable);
};

/**
 * Update a Papsable
 */
exports.update = function(req, res) {
	var papsable = req.papsable;

	papsable = _.extend(papsable, req.body);

	papsable.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(papsable);
		}
	});
};

/**
 * Delete an Papsable
 */
exports.delete = function(req, res) {
	var papsable = req.papsable;

	papsable.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(papsable);
		}
	});
};

/**
 * List of Papsables
 */
exports.list = function(req, res) {
	Papsable.find().sort('-created').populate('user', 'displayName').exec(function(err, papsables) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(papsables);
		}
	});
};

/**
 * Papsable middleware
 */
exports.papsableByID = function(req, res, next, id) {
	Papsable.findById(id).populate('user', 'displayName').exec(function(err, papsable) {
		if (err) return next(err);
		if (!papsable) return next(new Error('Failed to load Papsable ' + id));
		req.papsable = papsable;
		next();
	});
};

/**
 * Papsable authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.papsable.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};