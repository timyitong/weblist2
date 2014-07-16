/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var BaseSchema = require('./base').schema;
var extend = require('mongoose-schema-extend');
var MODEL_NAME = 'zipCode';
var modelSchema;

/**
 * Define Schema
 */
modelSchema = BaseSchema.extend({
    code: {
        required: true,
        type: String
    },
    city: {
    	required: true,
        type: ObjectId,
        ref: 'city'
    },
    region: {
    	required: true,
        type: ObjectId,
        ref: 'region'
    },
    country: {
    	required: true,
        type: ObjectId,
        ref: 'country'
    }
});

/**
 * Expose Schema and model
 */
module.exports = {
    name: MODEL_NAME,
    schema: modelSchema,
    model: mongoose.model(MODEL_NAME, modelSchema)
};