MODEL_PATH = "../models/";

function loadModel(modelName) {
    return require(MODEL_PATH + modelName).model;
}

module.exports = {
    ImageModel: loadModel('image'),
    HouseModel: loadModel('house'),
    UserModel: loadModel('user'),
    UserProfileModel: loadModel('userProfile'),
    CityModel: loadModel('city'),
    RegionModel: loadModel('region'),
    CountryModel: loadModel('country'),
    ZipCodeModel: loadModel('zipCode')
};