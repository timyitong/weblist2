/**
 * PasswordRestRequestModel
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

/**
 * Define Schema
 */
var schema = new Schema({
    userId: {
        required: true,
        type: ObjectId,
        ref: 'user'
    },
    hash: {
    	required: true,
    	type: String
    }
});

/**
 * Expose Schema and model
 */
module.exports = schema;