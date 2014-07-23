// SCHEMA - house

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
// TODO fix location dependencies
// var LocationSchema = require('./location');
var CommentSchema = require('./comment');

/**
 * Define Schema
 */
var schema = new Schema({
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
    },
    comments: [CommentSchema]
});

/**
 * Expose Schema and model
 */
module.exports = schema;