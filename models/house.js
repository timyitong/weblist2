/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var LocationSchema = require('./location').schema;
var extend = require('mongoose-schema-extend');
var MODEL_NAME = 'house';
var modelSchema;

/**
 * Define Schema
 */
modelSchema = LocationSchema.extend({
    title: {
        required: true,
        type: String
    },

    description: {
        required: true,
        type: String
    },

    user_id: ObjectId,

    price: {
        value : Number,
        unit : String
    },
    // Should be a list of file names, (unique tmp codes)
    images: [{
        _id : String,
        extension : String
    }],
    houseTypes: [String],
    // The year of founded date
    builtIn: Number,

    bathroomNum: Number,
    lavatoryNum: Number,
    bedroomNum: Number,
    areaSize: {
        value: Number,
        unit: String
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