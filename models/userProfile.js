module.exports = function(app, modelName) {
    var mongoose = app.mongoose;
    var Schema = mongoose.Schema;
    var ObjectId= Schema.ObjectId;

    var SchemaConfig = {
        userId: ObjectId,
        username: String,
        avatar: {
            _id: ObjectId,
            extension: String
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