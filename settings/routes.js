CONTROLLER_PATH = "../controllers/";

function loadController(app, controllerName) {
    return require(CONTROLLER_PATH + controllerName)(app);
}

module.exports = function(app){

    loadController(app, 'application');

    loadController(app, 'house');
    loadController(app, 'location');
    loadController(app, 'user');

    return this;
}