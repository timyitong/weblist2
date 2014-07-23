/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var BaseSchema = require('./base');
var extend = require('mongoose-schema-extend');
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
    },
    country_code: {
        required: true,
        type: String
    }
});

/**
 * Expose Schema and model
 */
module.exports = modelSchema;