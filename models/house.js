module.exports = function(app, modelName) {
    var mongoose = app.mongoose;    
    var Schema = mongoose.Schema;
    var ObjectId= Schema.ObjectId;

    var SchemaConfig = {
        title: String,
        description: String,

        user_id: ObjectId,
        location_id: ObjectId,
        
        price: Number,
        // Should be a list of file names, (unique tmp codes)
        photos: [String],
        houseTypes: [String],
        // The year of founded date
        foundedIn: Number,
        
        bathroomNum: Number,
        lavatoryNum: Number,
        livingroomNum: Number,
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
    });

    return mongoose.model(modelName, modelSchema);
}