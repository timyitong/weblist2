MODEL_PATH = "../models/";

function loadModel(app, modelName) {
    return require(MODEL_PATH + modelName)(app, modelName);
}

module.exports = function(app){

    this.CredentialModel = loadModel(app, 'credential');
    // Image Model must be initialized before other references
    this.ImageModel = loadModel(app, 'image');

    this.HouseModel = loadModel(app, 'house');
    this.UserModel = loadModel(app, 'user');

    // location models
    this.LocationModel = loadModel(app, 'location');
    this.CityModel = loadModel(app, 'city');
    this.RegionModel = loadModel(app, 'region');
    this.CountryModel = loadModel(app, 'country');
    this.ZipCodeModel = loadModel(app, 'zipCode');    

    return this;
}