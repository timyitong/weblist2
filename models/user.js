// SCHEMA - user
// !This table stores email/password, should never be rendered.

// Module Dependencies
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

// Define schema
var schema = new Schema({
    email: String,
    hash: String,
    /* salt does not need to be stored, see:
     *      http://stackoverflow.com/questions/277044/do-i-need-to-store-the-salt-with-bcrypt
     */
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

schema.virtual('password').get(function () {
    return this.hash;
});

schema.virtual('id').get(function () {
    return this._id;
});

schema.methods.validPassword = function (password, done) {
    // This is very important! this only returns the instance living in the direct method call
    // Without saving it, we cannot return user instance later.
    var user = this;

    bcrypt.compare(password, user.hash, function(err, validated) {
        if (err) return done(err);
        if (validated) {
            return done(null, user);
        } else{
            return done(null, false);
        }
    });
}

module.exports = schema;