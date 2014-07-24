/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    BaseSchema = require('./base').schema,
    extend = require('mongoose-schema-extend'),
    bcrypt = require('bcrypt'),
    MODEL_NAME = 'user',
    modelSchema;

/**
 * Define Schema
 */
modelSchema = BaseSchema.extend({
    email: String,
    password: String,
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

/**
 * Encrypt password before saving data.
 */
modelSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

modelSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

/**
 * Expose Schema and model
 */
module.exports = {
    name: MODEL_NAME,
    schema: modelSchema,
    model: mongoose.model(MODEL_NAME, modelSchema)
};