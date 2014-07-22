/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var BaseSchema = require('./base').schema;
var extend = require('mongoose-schema-extend');
var MODEL_NAME = 'userCollectionList';
var modelSchema;

/**
 * Define Schema
 */
modelSchema = BaseSchema.extend({
    userId: ObjectId,
    collectionList: [{
        typeName: {type: String, enum: ['house', 'item', 'car']},
        collectionId: ObjectId
    }]
});

/**
 * Expose Schema and model
 */
module.exports = {
    name: MODEL_NAME,
    schema: modelSchema,
    model: mongoose.model(MODEL_NAME, modelSchema)
};