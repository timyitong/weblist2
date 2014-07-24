/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var BaseSchema = require('./base');
var ObjectId = mongoose.Schema.ObjectId;
var extend = require('mongoose-schema-extend');
var modelSchema;

/**
 * Define Schema
 */
modelSchema = BaseSchema.extend({
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
    },

    street: String,

    buildingName: String,

    roomNumber: String,

    //TODO we might need to make this as a pointer in the future.
    zipCode: String,

    geoLocation: {
        latitude: String,
        longitude: String
    }
});

/**
 * Expose Schema and model
 */
module.exports = modelSchema;