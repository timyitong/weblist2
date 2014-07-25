// SCHEMA - user
// !This table stores email/password, should never be rendered.

// Module Dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt');

// Define schema
var schema = new Schema({
    // We use passport-local-mongoose to automatically create the following fields:
    //   username: String
    //   hash: String
    //   salt: String
    email: String,
    password: String,

    profile: {type: Schema.Types.ObjectId, ref: 'userProfile'},
    facebook: {
        id: String,
        accessToken: String,
        email: String,
        name: String,
        firstName: String,
        lastName: String
    },
    twitter: {
        id: String,
        accessToken: String,
        tokenSecret: String,
        displayName: String,
        username: String,
        email: String
    },
    google: {
        id: String,
        accessToken: String,
        email: String,
        name: String
    }
});

// Bind passport-local-mongoose plugin. 
schema.plugin(passportLocalMongoose, {
// Changing the below settings will prevent existing users to authenticate
    saltlen: 32,
    iterations: 25000,
    keylen: 512,
// Other settings:
});

schema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = schema;