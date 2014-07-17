module.exports = function(app) {
    var _ = require('underscore');
    var models = app.models;
    var ObjectId = app.mongoose.Types.ObjectId;

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
    });

    app.get('/user/edit', function (req, res) {
        if (req.session.uid == undefined) {
            return res.redirect("/signin");
        }

        return models.UserModel.findById({_id: ObjectId(req.session.uid)}, function (err, user) {
            if (!err) {
                models.UserProfileModel.findOne({userId: ObjectId(user._id)}, function (err, profile) {
                    if (!err) {
                        return res.render('user/edit.jade', {user: user, profile: profile});                        
                    } else {
                        return res.redirect('/');
                    }
                });
            } else {
                return res.redirect('/');
            }
        });
    });

    app.post('/user/edit', function (req, res) {
        if (req.session.uid == undefined) {
            return res.redirect('/signin');
        }
        var password = req.body.password;

        if (password != undefined && password.length != 0) {
            if (password != req.body.password2) {
                res.send({"message": "Password unmatched."});
            } else {
                app.models.UserModel.findOne({ _id: ObjectId(req.session.uid) }, function(err, user) {
                    user.password = password;
                    user.save(function(err) {
                        if (!err) {
                            console.log('password updated.');
                        } else {
                            console.log(err);
                        }
                    });
                });
            }
        }

        if (req.body.username != undefined) {
            models.UserProfileModel.findOneAndUpdate(
                  { userId: ObjectId(req.session.uid) }
                , { $set: { username: req.body.username
                          }
                  }, function (err, profile) {
                    res.redirect('/user/view');
                }
            );
        }
    });

    // Upload images for House
    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart();
    app.post('/user/avatar', multipartMiddleware, function (req, res) {
        if (req.files && req.session.uid != undefined) {
            var tmpPath = req.files['photo'].path;
            var oldName = req.files['photo'].name;
            var uid = req.session.uid;

            // Get the file extension
            var extension = oldName.substring(oldName.lastIndexOf('.'), oldName.length);
            var imageObj = new models.ImageModel({
                title: 'uid',
                extension: extension
            });

            // Store image info into db
            imageObj.save(function (err, image) {
                // Distination Directory
                var dstDir = app.application_root + '/static/uploads/' + image._id + '/';
                // mkdir
                app.fs.mkdirSync(dstDir);
                _.each(image.formats, function (imageFormat) {
                    var srcPath = tmpPath;
                    var dstPath = dstDir + imageFormat.name + extension;
                    var width = imageFormat.size;

                    // Resize the image
                    app.im.resize({
                        srcPath: srcPath,
                        dstPath: dstPath,
                        width: width,
                        quality: 0.9
                    }, function (err, stdout, stderr) {
                        console.log(dstPath);
                        if (!err) {
                            return console.log("Avatar resized");
                        } else {
                            console.log(err + "\n message: " + stderr);
                        }
                    });
                });
                // Save Avatar to Profile
                models.UserProfileModel.findOneAndUpdate(
                      { userId: ObjectId(uid) }
                    , { $set: { avatar: { _id: image._id,
                                          extension: image.extension
                                        }
                              }
                      }, function (err, profile) {
                        res.redirect('/user/view/' + profile.userId);
                    }
                );
            });
        } else {
            res.send("No file provided");
        }
    });

    app.get('/user/view', function (req, res) {
        return res.redirect('/user/view/' + req.session.uid);
    });

    app.get('/user/view/:id', function (req, res) {
        var uid = req.params.id;
        if (uid == undefined) {
            if (req.session.uid == undefined) {
                return res.redirect('/signin');
            } else{
                uid = req.session.uid;
            }
        }

        models.UserModel.findOne({_id: ObjectId(uid)}, function (err, user) {
            if (!err) {
                return models.UserProfileModel.findOne({userId: user._id}, function (err, profile) {
                    res.render('user/view.jade', {user: user, profile: profile, canEdit: uid == req.session.uid});
                });
            } else {
                return res.redirect('/');
            }
        });
    });

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

                // Save Basic user information 
                newUser.save(function (err) {
                    if (!err) {
                        req.session.uid = newUser._id;
                        res.cookie('uid', newUser._id, {maxAge: 365 * 24 * 60 * 60 * 1000});


                        // Build user profile
                        var atPosition = newUser.email.indexOf('@');
                        atPosition = atPosition == -1 ? newUser.email.length : atPosition;
                        var profile = new models.UserProfileModel({
                            username: newUser.email.substring(0, atPosition),
                            userId: newUser._id
                        });
                        // Save user profile 
                        return profile.save(function (err) {
                            res.redirect('/');
                        });
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