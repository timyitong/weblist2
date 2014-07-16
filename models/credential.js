/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    BaseSchema = require('./base').schema,
    extend = require('mongoose-schema-extend'),
    bcrypt = require('bcrypt'),
    MODEL_NAME = 'credential',
    modelSchema;

/**
 * Define Schema
 */
modelSchema = BaseSchema.extend({
    credential: String
});

/**
 * Encrypt password before saving data.
 */
modelSchema.pre('save', function(next) {
    var salt = app.bcrypt.genSaltSync(10);
    var hash = app.bcrypt.hashSync(this.credential, salt);
    console.log('Storing credential.');
    this.credential = hash;
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