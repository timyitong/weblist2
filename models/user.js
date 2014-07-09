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
});

/**
 * Encrypt password before saving data.
 */
modelSchema.pre('save', function(next) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(this.password, salt);
    console.log('Storing password');
    this.password = hash;
    next();
});

/**
 * Expose Schema and model
 */
module.exports = {
    name: MODEL_NAME,
    schema: modelSchema,
    model: mongoose.model(MODEL_NAME, modelSchema)
};