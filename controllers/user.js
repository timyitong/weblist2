module.exports = function(app) {

    var models = app.models;

    app.post('/signin', function (req, res) {
        return models.UserModel.findOne({ email: req.body.email }, function(err, user) {
            if (err){
                return res.send('Login failed caused by database. ' + err);
            }
            if (user == undefined) {
                console.log('email not found');
                return res.send('Email address not found.');                
            } else if (app.bcrypt.compareSync(req.body.password,user.password)){
                console.log('login success');
                req.session.uid = user._id;
                res.cookie('uid', user._id, {maxAge: 365 * 24 * 60 * 60 * 1000})
                return res.render('home/index.jade', { message: 'Login success.' });
            } else {
                console.log('password does not match');
                return res.send('Password Not Matched');
            }
        });
    });

    app.get('/signin', function (req, res){
        res.render('user/login.jade', {});
    });

    //TODO This should be using post request in future
    app.get('/signout', function (req,res) {
        req.session.uid = undefined;
        req.cookies.uid = undefined;
        res.cookie('uid', undefined);
        res.redirect('/signin');
    })

    app.post('/signup', function (req, res) {
        
        return models.UserModel.findOne({ email: req.body.email }, function(err, user) {
            if (err) {
                return res.send('Login failed caused by database. ' + err);
            }
            if (user == undefined) {
                var newUser = new models.UserModel({
                    email: req.body.email,
                    password: req.body.password,
                });
                newUser.save(function (err) {
                    if (!err) {
                        req.session.uid = newUser._id;
                        res.cookie('uid', newUser._id, {maxAge: 365 * 24 * 60 * 60 * 1000})
                        return res.redirect('/');
                    } else {
                        return res.render(
                            'user/signup.jade',
                            { message:  'An error occurred during signing up.'}
                        );
                    }
                });              
            } else {
                return res.render(
                    'user/signup.jade',
                    { message: 'Email address already used. ' + req.body.email }
                );
            }
        });
    });

    app.get('/signup', function (req, res) {
        res.render("user/signup.jade", {});
    });


    return this;
}