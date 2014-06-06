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

	var q = Campaign.find().sort('-created').populate('user', 'displayName');

	if (Object.keys(req.query).length > 0)
		q.where('start').gte(new Date());

	q.exec(function(err, campaigns) {
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
 * Paps d'une campagne
 */

exports.paps = function(req, res) {
	var campaign = req.campaign;
	var user = req.user;
	var papsable = req.query.papsableId || -1;

	if (papsable === -1){
		res.jsonp({'error': 1});
		return;
	}

	// On récupère le bon pasable
	campaign.papsables.forEach(function(el){
		if (el._id.toString() === papsable){
			papsable = el;
		}
	});

	if (typeof papsable === 'string')
		return res.jsonp({error: 1, msg: 'Pas de Papsable correspondant'});

	// On vérifie si le PAPS est en cours
	var now = (new Date()).getTime();
	var start = campaign.start.getTime();

	if (start > now)
		res.jsonp({error: 1, msg: 'Le PAPS n\'est pas en cours'});
	else {

		// Vérifier s'il reste des places dans ce papsable
		if (papsable.amount === 0){
			res.jsonp({error: 1, msg: 'Plus de places disponibles'});
			return;
		}

		// Si possible on attribue le paps à l'utilisateur
		user.populate('papsables');

		var added = false;

		user.papsables.forEach(function (el){
			if (el._id.toString() === papsable._id.toString() && !added){
				added = true;
				if (el.amount < papsable.max || papsable.max === -1 ){
					el.amount++;
					papsable.amount--;
					return res.jsonp({error: 0, msg: 'PAPS réussi', campaign: campaign});
				}else{
					res.jsonp({error: 1, msg: 'Vous avez déjà le nombre max'});
					return;
				}
			}
		});

		if (!added && papsable.max > 0){
			user.papsables.push({
				object: papsable.object._id,
				slot: papsable.slot,
				amount: 1,
				_id: papsable._id
			});
			papsable.amount--;
			return res.jsonp({error: 0, msg: 'PAPS réussi', campaign: campaign});
		}

		user.save(function(err) {
			if (err) {
				return res.send(400, {
					message: getErrorMessage(err)
				});
			}
		});

		campaign.save(function(err) {
			if (err) {
				return res.send(400, {
					message: getErrorMessage(err)
				});
			}
		});
		// @TODO Push en websocket le nombre de PAPS restant
	}
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