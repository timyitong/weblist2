module.exports = function(app) {
    var models = app.models;

    app.post('/signin', function (req, res) {

    });

    app.post('/user/create', function (req, res) {
        var user= new models.UserModel({
            email: req.body.email,
            password: req.body.password,
        });

        user.save(function (err) {
            console.log(err);
            if (!err) {
                req.session.uid = user._id;
                return res.redirect("/");
            } else {
                return res.render('user/new.jade',
                        {message:  "An error occurred during signing up."});
            }
        });
    });

    app.get('/signup', function (req, res) {
        res.render("user/new.jade", {});
    });


    return this;
}