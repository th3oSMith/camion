'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Campaign Schema
 */
var CampaignSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Campaign name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Entrez une description pour le PAPS',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	start: {
		type: Date,
		required: 'Please set a start date for the campaign'
	},
	secret: {
		type: Boolean,
		default: true
	},
	end: {
		type: Date,
		default: null
	},
	papsables: [{
		object:{
			type: Schema.ObjectId,
			ref: 'Papsable'
			},
		amount: {
			type: Number,
			required: 'Spécifier la quantité !'
		},
		slot: {
			type: String
		},
		max: {
			type: Number,
			default: -1
		},
		id: {
			type: Number
		}
	}]
});

mongoose.model('Campaign', CampaignSchema);