module.exports = function(app, modelName) {
    var mongoose = app.mongoose;    
    var Schema = mongoose.Schema;
    var ObjectId= Schema.ObjectId;
    var bcrypt = app.bcrypt;

    var SchemaConfig = {
        credential: String,

        createTime: {type: Date, default: Date.now},
        updateTime: {type: Date},
    };

    var modelSchema = new Schema(SchemaConfig);

    // Bind events
    modelSchema.pre('store', function(next, done) {
        var salt = app.bcrypt.genSaltSync(10);
        var hash = app.bcrypt.hashSync(this.credential, salt);

        this.credential = hash;
        now = new Date();

        this.updateTime = now;
        if ( !this.createTime ) {
            this.createTime = now;
        }

        next();
    });

    return mongoose.model(modelName, modelSchema);
}