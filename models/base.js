/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    modelSchema;

/**
 * Define Schema
 */
modelSchema = new Schema({
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date }
});

/**
 * Store timestamp before saving data.
 */
modelSchema.pre('save', function(next) {
    console.log('Saving timestamp');
    now = new Date();
    this.updateTime = now;
    if ( !this.createTime ) {
        this.createTime = now;
    }
    next();
});

/**
 * Expose Schema
 */
module.exports = modelSchema;