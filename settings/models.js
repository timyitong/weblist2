MODEL_PATH = "../models/";

function loadModel(app, modelName) {
    return require(MODEL_PATH + modelName)(app, modelName);
}

module.exports = function(app){

    this.CredentialModel = loadModel(app, 'credential');
    this.HouseModel = loadModel(app, 'house');
    this.UserModel = loadModel(app, 'user');

    return this;
}