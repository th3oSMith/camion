'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

/**
 * Papsed Schema
 */
 var PapsedSchema = new Schema({
    object:{
        type: Schema.ObjectId,
        ref: 'Papsable'
    },
    slot: {
        type: String
    },
    amount: {
        type: Number
    },
    campaign: {
        type: Schema.ObjectId,
        ref: 'Campaign'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    papsable: {
        type: String
    }
});

 mongoose.model('Papsed', PapsedSchema);