module.exports = function(app, modelName) {
    var mongoose = app.mongoose;    
    var Schema = mongoose.Schema;
    var ObjectId= Schema.ObjectId;

    var SchemaConfig = {
        title: String,
        formats: {
            type: [
                {
                    name: String,
                    size: Number
                }
            ],
            default: [
                {
                    name: 'large',
                    size: 600
                },
                {
                    name: 'medium',
                    size: 200
                },
                {
                    name: 'small',
                    size: 50
                },
                {
                    name: 'mini',
                    size: 38
                }
            ]
        },
        extension: String,

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