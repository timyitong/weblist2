// location model
module.exports = function(app, modelName) {
    var mongoose = app.mongoose;
    var Schema = mongoose.Schema;
    var ObjectId= Schema.ObjectId;

    var SchemaConfig = {
        country: {
            required: true,
            type: ObjectId,
            ref: 'country'
        },

        region: {
            required: true,
            type: ObjectId,
            ref: 'region'
        },

        city: {
            required: true,
            type: ObjectId,
            ref: 'city'
        },

        street: {
            required: true,
            type: String
        },

        buildingName: String,

        roomNumber: String,

        zipCode: {
            required: true,
            type: String
        },

        geoLocation: {
            lat: String,
            lon: String
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