'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Papsable Schema
 */
var PapsableSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Papsable name',
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
	properties: {
		type: Schema.Types.Mixed,
		default: {}
	},
	slots: [{
		type: String,
		trim: true
	}]
});

mongoose.model('Papsable', PapsableSchema);