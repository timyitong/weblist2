// Constants
var MODEL_PATH = "../models/";
var MODEL_PLUGINS_PATH = MODEL_PATH + "plugins/";

// Import Modules
var mongoose = require("mongoose"),
    autoTimeFields = require(MODEL_PLUGINS_PATH + "autoTimeFields");
    // autoIncrement = require('mongoose-auto-increment');

function loadModel(modelName, options) {
    // Retrieve model Schema by name
    var schema = require(MODEL_PATH + modelName);

    // 1. Global Shared Plugins (all models need them)
    schema.plugin(autoTimeFields);

    /* 2. Group Shared Plugins (some models need them)
     * 
     * Notice: we can use this field to do optional schemas,
     * but it is recommended to put them directly into models (making them 
     * as private).
     */

    /* mongoose-autoincrement plugin, it CANNOT be binded without knowing the 
     * name of the model!!
     */
    // if (options) {
    //     if (options.autoIncrement) {
    //         if (options.autoIncrementOptions) {
    //             schema.plugin(autoIncrement.plugin, autoIncrementOptions);
    //         } else {
    //             schema.plugin(autoIncrement.plugin, modelName);                
    //         }
    //     }
    // }

    // Return model
    return mongoose.model(modelName, schema);
}

module.exports = models = {
    ImageModel: loadModel('image'),
    HouseModel: loadModel('house'),
    UserModel: loadModel('user'),
    UserProfileModel: loadModel('userProfile'),
    UserCollectionListModel: loadModel('userCollectionList'),
    CityModel: loadModel('city'),
    RegionModel: loadModel('region'),
    CountryModel: loadModel('country'),
    ZipCodeModel: loadModel('zipCode')
};