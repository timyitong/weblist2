module.exports = function(app) {
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjectId = Schema.Types.ObjectId,
        models = require('../settings/models');

    //index:
    app.get('/', function (req, res) {
        res.render('home/index.jade', {message:"Welcome to Weblist"});
    })

    return this;
}