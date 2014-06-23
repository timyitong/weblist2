// zip code model
module.exports = function(app, modelName) {
    var mongoose = app.mongoose;
    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;

    var SchemaConfig = {
        code: {
            required: true,
            type: String
        },
        city: {
            type: ObjectId,
            ref: 'city'
        },
        region: {
            type: ObjectId,
            ref: 'region'
        },
        country: {
            type: ObjectId,
            ref: 'country'
        },
        createTime: {type: Date, default: Date.now},
        updateTime: {type: Date},
    };

    var modelSchema = new Schema(SchemaConfig);

    // Bind events
    modelSchema.pre('save', function(next, done) {
        now = new Date();
        
        this.updateTime = now;
        if ( !this.createTime ) {
            this.createTime = now;
        }

        next();
    });

    return mongoose.model(modelName, modelSchema);
}