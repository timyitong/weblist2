module.exports = function(app) {
    var _ = require('underscore');
    var models = require('../settings/models');
    var Schema = require('mongoose').Schema.Types.ObjectId;
    var passport = require('passport');
    var bcrypt = require('bcrypt');

    app.post('/login', function (req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.render('user/login.jade', {message: 'Login failed.'});    
            }

            // Prefer lower cases function call: login than logIn
            req.login(user, function(err) {
            	console.log('login success.');
                if (err) {
                    return next(err);
                }
                var back = req.session.returnTo;
                if (back == undefined) {
                    back = '/';
                }
                res.redirect(back);
            });
        })(req, res, next);
    });

    app.get('/login', function (req, res){
        res.render('user/login.jade', {});
    });

    // I think GET is fine in this case. This is more easier to use in the frontend.
    app.get('/logout', function (req,res) {
        // Call passport request.logout()
        req.logout();
        // Redirect page
        res.redirect('/login');
    });

    // TODO
    app.get('/user/edit', function (req, res) {
        if (req.session.uid == undefined) {
            return res.redirect('/login');
        }

        return models.UserModel.findById({_id: req.session.uid}).populate('profile').exec(function (err, user) {
            if (!err) {
                console.log(user);
                return res.render('user/edit.jade', {user: user});                        
            } else {
                return res.redirect('/');
            }
        });
    });

    // TODO
    app.post('/user/edit', function (req, res) {
        if (req.session.uid == undefined) {
            return res.redirect('/login');
        }
        var password = req.body.password;

        if (password != undefined && password.length != 0) {
            if (password != req.body.password2) {
                res.send({"message": "Password unmatched."});
            } else {
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(password, salt);
                password = hashedPassword;

                app.models.UserModel.findOneAndUpdate({_id: req.session.uid}
                    , { $set: {password: password} }
                    , function (err, user) {
                        // TODO a potential bug: not sending any response
                        console.log("password changed");
                        console.log(err);
                    }
                );
            }
        }

        if (req.body.username != undefined) {
            models.UserProfileModel.findOneAndUpdate(
                  { userId: req.session.uid }
                , { $set: { username: req.body.username
                          }
                  }, function (err, profile) {
                    res.redirect('/user');
                }
            );
        }
    });

    // TODO
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
                      { userId: uid }
                    , { $set: { avatar: { _id: image._id,
                                          extension: image.extension
                                        }
                              }
                      }, function (err, profile) {
                        res.redirect('/user/' + profile.userId);
                    }
                );
            });
        } else {
            res.send("No file provided");
        }
    });

    app.get('/user', function (req, res) {
        return res.redirect('/user/' + req.session.uid);
    });

    app.get('/user/:id', function (req, res) {
        var uid = req.params.id;
        if (uid == undefined) {
            if (req.session.uid == undefined) {
                return res.redirect('/login');
            } else{
                uid = req.session.uid;
            }
        }

        models.UserProfileModel.findOne({userId: uid}, function (err, profile) {
            if (!err) {
                return res.render('user/view.jade', {profile: profile, canEdit: uid == req.session.uid});
            } else {
                return res.redirect('/');
            }
        });
    });

    /* Nested structure should be used if we want to control 
     * details like redirect to the place before logging
     */
    app.post('/signup', function(req, res, next) {
        passport.authenticate('local-signup', function (err, user, info) {
            if (err) {
                return next(err); 
            }
            if (!user) {
                return res.redirect('/signup'); 
            }
            
            // req.logIn or req.login is equivalent, lowercase preferred :D
            req.logIn(user, function(err) {
                            console.log(user);
                if (err) { return next(err); }
                var back = res.locals.returnTo;
                if (!back) {
                    back = '/';
                }
                res.redirect(back);
            });
        })(req, res, next); // important to put this <- if we need this nested structure
    });
    // app.post('/signup', passport.authenticate('local-signup', {
    //     successRedirect: '/',
    //     failureRedirect: '/login'
    // }));

    /* Old signup DO NOT DELETE UNLESS CONFIRMED*/
    // app.post('/signup', function (req, res) {

    //     return models.UserModel.findOne({ email: req.body.email }, function(err, user) {
    //         if (err) {
    //             return res.send('Login failed caused by database. ' + err);
    //         }
    //         if (user == undefined) {
    //             var newUser = new models.UserModel({
    //                 email: req.body.email,
    //                 password: req.body.password
    //             });

    //             // Save Basic user information 
    //             newUser.save(function (err) {
    //                 if (!err) {
    //                     req.session.uid = newUser._id;
    //                     res.cookie('uid', newUser._id, {maxAge: 365 * 24 * 60 * 60 * 1000});

    //                     // Build user profile
    //                     var atPosition = newUser.email.indexOf('@');
    //                     atPosition = atPosition == -1 ? newUser.email.length : atPosition;
    //                     var profile = new models.UserProfileModel({
    //                         username: newUser.email.substring(0, atPosition),
    //                         userId: newUser._id
    //                     });
    //                     // Save user profile 
    //                     return profile.save(function (err, profile) {
    //                         newUser.profile = profile._id;
    //                         // Save user's ref to profile
    //                         newUser.save(function (err) {
    //                             req.session.username = profile.username;
    //                             res.cookie('username', profile.username, {maxAge: 365 * 24 * 60 * 60 * 1000});


    //                             // Set Avatar
    //                             req.session.avatar = profile.avatar;
    //                             res.cookie('avatar', profile.avatar, {maxAge: 365 * 24 * 60 * 60 * 1000});
    //                             res.redirect('/');
    //                         });
    //                     });
    //                 } else {
    //                     return res.render(
    //                         'user/signup.jade',
    //                         { message:  'An error occurred during signing up.'}
    //                     );
    //                 }
    //             });              
    //         } else {
    //             return res.render(
    //                 'user/signup.jade',
    //                 { message: 'Email address already used. ' + req.body.email }
    //             );
    //         }
    //     });
    // });

    app.get('/signup', function (req, res) {
        res.render("user/signup.jade", {});
    });

    app.get('/user/:id/collectionList', function(req, res) {
        return models.UserCollectionListModel.findOne({userId: req.params.id}, function (err, list) {
            if (list) {
                return res.send(list);
            } else {
                console.log(err);
                return res.send({message: "error"});
            }
        });
    });

    app.post('/user/collectionList', function(req, res) {

    });


    return this;
}