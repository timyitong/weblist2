/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var BaseSchema = require('./base').schema;
var extend = require('mongoose-schema-extend');
var MODEL_NAME = 'image';
var modelSchema;

/**
 * Define Schema
 */
modelSchema = BaseSchema.extend({
    title: String,
    formats: {
        type: [
            {
                name: String,
                size: Number
            }
        ],
        default: [
            {
                name: 'large',
                size: 600
            },
            {
                name: 'medium',
                size: 200
            },
            {
                name: 'small',
                size: 50
            },
            {
                name: 'mini',
                size: 38
            }
        ]
    },
    extension: String,
});

/**
 * Expose Schema and model
 */
module.exports = {
    name: MODEL_NAME,
    schema: modelSchema,
    model: mongoose.model(MODEL_NAME, modelSchema)
};