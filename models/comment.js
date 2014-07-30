// SCHEMA - comment

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
    parentId : ObjectId,
    fromUser : {type: ObjectId, ref: 'user'},
    toUser : {type: ObjectId, ref: 'user'},
    text : String
});

/**
 * Expose Schema and model
 */
module.exports = schema;