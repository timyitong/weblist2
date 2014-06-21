CONTROLLER_PATH = "../controllers/";

function loadController(app, controllerName) {
    return require(CONTROLLER_PATH + controllerName)(app);
}

module.exports = function(app){

    loadController(app, 'application');

    loadController(app, 'user');
    loadController(app, 'house');

    return this;
}