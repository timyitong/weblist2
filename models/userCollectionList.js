// SCHEMA - userCollectionList

// TODO we can improve this via populate

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var schema;

/**
 * Define Schema
 */
var schema = new Schema({
    userId: Number,
    collectionList: [{
        typeName: {type: String, enum: ['house', 'item', 'car']},
        collectionId: ObjectId
    }]
});

/**
 * Expose Schema and model
 */
module.exports = schema;