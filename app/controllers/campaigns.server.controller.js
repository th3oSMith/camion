'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Campaign = mongoose.model('Campaign'),
	Papsed = mongoose.model('Papsed'),
	socket = require('../../config/socket.js'),
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

	if (req.query.papsed) {
		var output = {};
		output.campaign = req.campaign;

		Papsed
		.find({campaign: req.campaign._id})
		.populate('object')
		.populate('user', 'displayName')
		.exec(function (err, papseds){

			if (err)
				return res.send(400, {
					message: getErrorMessage(err)
				});

				output.papseds = papseds;

				res.jsonp(output);

		});
	}
	else{
		res.jsonp(req.campaign);
	}
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

	var q = Campaign.find().where('user').equals(req.user._id).sort('-created').populate('user', 'displayName');

	if (req.query.future){
		q.where('start').gte(new Date());
		q.where('secret').equals(false);
	}

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
		return res.send(400, {
			message: 'PAPS pas encore lancé'
		});
	else {

		// Vérifier s'il reste des places dans ce papsable
		if (papsable.amount === 0){
			return res.send(400, {
				message: 'PAPS complet'
			});
		}

		// Si possible on attribue le paps à l'utilisateur
		// user.populate('papsables');

		var added = false;


		Papsed
			.find({campaign: campaign._id})
			.where('user').equals(req.user._id)
			.exec(function (err, papseds) {
				if (err)
					return res.send(400, {
						message: getErrorMessage(err)
					});

				// On vérifie que l'utilisateur ne dépasse pas le nmobre de PAPS autorisé

				// PAPS par campagne
				if (papseds.length >= campaign.max && campaign.max !== -1){
					return res.send(400, {
							message: 'Nombre max de Paps atteint pour cette campagne'
						});
				}

				// On recherche pour notre papsable

				Papsed.findOne({campaign: campaign._id})
					.where('papsable').equals(papsable._id)
					.where('user').equals(req.user._id)
					.exec(function (err, papsed){

					if (err)
						return err;

					if (papsed){ // L'utilisateur a déjà papsé se papsable
						
						if (papsed.amount >= papsable.max && papsable.max !== -1){
							return res.send(400, {
									message: 'Nombre max de Paps atteint'
								});
						}else{
							papsed.amount++;
							papsable.amount--;

							papsed.save(function(err) {
								if (err) {
									return res.send(400, {
										message: getErrorMessage(err)
									});
								}
							});
						}
					}else{ // L'utilisateur n'a encore pas papsé ce papsable

						var newPapsed = new Papsed({
							papsable: papsable._id,
							object: papsable.object._id,
							slot: papsable.slot,
							campaign: campaign._id,
							amount: 1,
							user:req.user._id
						});

						papsable.amount--;

						newPapsed.save(function(err, newObject) {
							if (err) {
								return res.send(400, {
									message: getErrorMessage(err)
								});
							}
						});
					}

					campaign.save(function(err) {
						if (err) {
							return res.send(400, {
								message: getErrorMessage(err)
							});
						}
					});

					//On met à jour via les websockets car il y a quelqu'un qui a papsé
					var io = socket.getIO();
					io.sockets.in(campaign._id).emit('update', {campaign: campaign});

					return res.send({message: 'PAPS Réussi', campaign: campaign});

				});

			});



		// user.papsables.forEach(function (el){
		// 	if (el._id.toString() === papsable._id.toString() && !added){
		// 		added = true;
		// 		if (el.amount < papsable.max || papsable.max === -1 ){
		// 			el.amount++;
		// 			papsable.amount--;
		// 			return res.jsonp({error: 0, msg: 'PAPS réussi', campaign: campaign});
		// 		}else{
		// 			res.jsonp({error: 1, msg: 'Vous avez déjà le nombre max'});
		// 			return;
		// 		}
		// 	}
		// });

		// if (!added && papsable.max > 0){
		// 	user.papsables.push({
		// 		object: papsable.object._id,
		// 		slot: papsable.slot,
		// 		amount: 1,
		// 		_id: papsable._id,
		// 		campaign: campaign._id
		// 	});
		// 	papsable.amount--;
		// 	res.jsonp({error: 0, msg: 'PAPS réussi', campaign: campaign});
		// }
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