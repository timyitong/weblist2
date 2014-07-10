/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var BaseSchema = require('./base').schema;
var extend = require('mongoose-schema-extend');
var MODEL_NAME = 'country';
var modelSchema;

/**
 * Define Schema
 */
modelSchema = BaseSchema.extend({
    name: {
        required: true,
        type: String
    },
    name_i18n: {
        ja: {
            required: true,
            type: String
        },
        en: {
            required: true,
            type: String
        }
    },
    code: {
        required: true,
        type: String
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