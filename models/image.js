// SCHEMA - image

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/**
 * Define Schema
 */
var schema = new Schema({
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
                size: 500
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
module.exports = schema;