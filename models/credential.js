// SCHEMA - credential

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

/**
 * Define Schema
 */
var schema = new Schema({
    credential: String
});

/**
 * Encrypt password before saving data.
 */
schema.pre('save', function(next) {
    var salt = app.bcrypt.genSaltSync(10);
    var hash = app.bcrypt.hashSync(this.credential, salt);
    console.log('Storing credential.');
    this.credential = hash;
    next();
});

/**
 * Expose Schema and model
 */
module.exports = schema;