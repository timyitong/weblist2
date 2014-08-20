/**
 * Notification Model
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
    notificationType: {
        required: true,
        type: String,
        enum: types
    },
    contentId: {
        required: true,
        type: ObjectId
    },
    read: {
        required: true,
        type: Boolean,
        default: false
    },
    recipient: {
        required: true,
        type: ObjectId,
        ref: 'user'
    }
});

/**
 * Expose Schema and model
 */
module.exports = schema;