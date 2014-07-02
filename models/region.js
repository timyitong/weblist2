// region model
module.exports = function(app, modelName) {
    var mongoose = app.mongoose;
    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;
    var Mixed = Schema.Types.Mixed;

    var SchemaConfig = {
        name: {
            required: true,
            type: String
        },
        name_i18n: {
            ja: {
                required: true,
                type: String
            },
            en: {
                required: true,
                type: String
            }
        },
        code: {
            required: true,
            type: String
        },
        country_code: {
            required: true,
            type: String
        },
        cities: [{
            type: ObjectId,
            ref: 'city'
        }],
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