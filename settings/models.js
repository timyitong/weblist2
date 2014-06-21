MODEL_PATH = "../models/";

function loadModel(app, modelName) {
    return require(MODEL_PATH + modelName)(app, modelName);
}

module.exports = function(app){

    this.HouseModel = loadModel(app, 'house');

    return this;
}