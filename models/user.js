// SCHEMA - user
// !This table stores email/password, should never be rendered.

// Module Dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

// Define schema
var schema = new Schema({
    email: String,
    password: String,
    profile: {type: Schema.Types.ObjectId, ref: 'userProfile'} 
});

// Encrypt password before saving data.
schema.pre('save', function(next) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(this.password, salt);
    console.log('Storing password');
    this.password = hash;
    next();
});

module.exports = schema;