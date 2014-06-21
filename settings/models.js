MODEL_PATH = "../models/";

function loadModel(app, modelName) {
    return require(MODEL_PATH + modelName)(app, modelName);
}

module.exports = function(app){

    this.UserModel = loadModel(app, 'user');
    this.HouseModel = loadModel(app, 'house');

    return this;
}