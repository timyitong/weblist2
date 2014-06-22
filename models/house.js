module.exports = function(app, modelName) {
    var mongoose = app.mongoose;    
    var Schema = mongoose.Schema;
    var ObjectId= Schema.ObjectId;

    var SchemaConfig = {
        title: String,
        description: String,

        user_id: ObjectId,
        location_id: ObjectId,
        
        price: {
            value : Number,
            unit : String
        },
        // Should be a list of file names, (unique tmp codes)
        photos: [String],
        houseTypes: [String],
        // The year of founded date
        foundedIn: Number,
        
        bathroomNum: Number,
        lavatoryNum: Number,
        bedroomNum: Number,
        areaSize: {
            value: Number,
            unit: String
        },

        createTime: {type: Date, default: Date.now},
        updateTime: {type: Date},
    };

    var modelSchema = new Schema(SchemaConfig);

    // Bind events
    modelSchema.pre('save', function(next) {
        now = new Date();

        this.updateTime = now;
        if ( !this.createTime ) {
            this.createTime = now;
        }

        next();
    });

    return mongoose.model(modelName, modelSchema);
}