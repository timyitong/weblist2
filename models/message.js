/**
 * Message Model
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

/**
 * Define Schema
 */
var schema = new Schema({
    body: String,
    from : {
        type: ObjectId,
        ref: 'user'
    },
    to : {
        type: ObjectId,
        ref: 'user'
    },
    read: Boolean,
    sentTime: Date,
    receivedTime: Date
});

/**
 * Expose Schema and model
 */
module.exports = schema;