// SCHEMA - userProfile

// Module dependencies.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


// Define Schema
var schema = new Schema({
    userId: {type: Number, ref: 'user'},
    username: String,
    avatar: {
        type: {
        _id: ObjectId,
        extension: String
        }
    }
});

module.exports = schema;