MODEL_PATH = "../models/";
MODEL_PLUGINS_PATH = MODEL_PATH + "plugins/";

var mongoose = require("mongoose");
var autoTimeFields = require(MODEL_PLUGINS_PATH + "autoTimeFields");
var autoIncrement = require('mongoose-auto-increment');

function loadModel(modelName, options) {
    // Retrieve model Schema by name
    var schema = require(MODEL_PATH + modelName);

    // Global shared plugins
    schema.plugin(autoTimeFields);

    // Append specific plugins
    // A special solution for auto increment field plugin,
        // logically, all plugins are defined for Schema, which means they should
        // not care about model name, but since auto-increment implementation needs
        // model name. We have to apply them here.
    // Also we can use this field to do optional schemas, but I recommend put them directly into model field
    if (options) {
        if (options.autoIncrement) {
            if (options.autoIncrementOptions) {
                schema.plugin(autoIncrement.plugin, autoIncrementOptions);
            } else {
                schema.plugin(autoIncrement.plugin, modelName);                
            }
        }
    }

    // Return model
    return mongoose.model(modelName, schema);
}

module.exports = {
    ImageModel: loadModel('image'),
    HouseModel: loadModel('house'),
    UserModel: loadModel('user', {autoIncrement: true}),
    UserProfileModel: loadModel('userProfile'),
    UserCollectionListModel: loadModel('userCollectionList'),
    CityModel: loadModel('city'),
    RegionModel: loadModel('region'),
    CountryModel: loadModel('country'),
    ZipCodeModel: loadModel('zipCode')
};