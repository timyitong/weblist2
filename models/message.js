/**
 * Message Model
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var types = ['userMessage', 'siteMessage'];
/**
 * Define Schema
 */
var schema = new Schema({
    body: {
        required: true,
        type: String
    },
    messageType: {
        required: true,
        type: String,
        enum: types
    },
    // sender can be null if the message is from site.
    sender : {
        type: ObjectId,
        ref: 'user'
    },
    recipient : {
        required: true,
        type: ObjectId,
        ref: 'user'
    },
    read: {
        required: true,
        type: Boolean,
        default: false,
    }
});

/**
 * Expose Schema and model
 */
module.exports = schema;