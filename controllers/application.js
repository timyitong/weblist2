module.exports = function(app) {
    var ObjectId = app.mongoose.Types.ObjectId;
    var models = app.models;

    //index:
    app.get('/', function (req, res) {
        res.render('home/index.jade', {message:"Welcome to Weblist"});
    })

    return this;
}