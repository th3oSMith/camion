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
	amount: {
		type: Number,
		default: 0,
		required: 'Please set the number of element available',
	},
	properties: {
		type: Schema.Types.Mixed,
		default: {}
	}
});

mongoose.model('Papsable', PapsableSchema);