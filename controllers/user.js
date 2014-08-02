module.exports = function(app) {
    var _ = require('underscore'),
        async = require('async'),
        fs = require('node-fs'),
        im = require('imagemagick'),
        models = require('../settings/models'),
        ObjectId = require('mongoose').Schema.Types.ObjectId,
        passport = require('passport'),
        bcrypt = require('bcrypt'),
        crypto = require('crypto'),
        validator = require('validator'),
        secrets = require('../config/secrets'),
        nodemailer = require('nodemailer');

    var PasswordResetRequestModel = models.PasswordResetRequestModel;
    var UserModel = models.UserModel;

    /**
     * GET /forget
     * Forgot password page.
     */
    app.get('/forgot', function(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/');
        }
        res.render('user/forgot.jade');
    });

    /**
     * POST /forgot
     * Create a random token, then send user an email with a reset link.
     */
    app.post('/forgot', function(req, res, next) {
        if (!validator.isEmail(req.body.email)) {
            return res.redirect('/forgot');
        };
        async.waterfall([
            // Get token
            function(done) {
                crypto.randomBytes(16, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            // Find user
            function(token, done) {
                UserModel.findOne({ email: req.body.email.toLowerCase() }, function(err, user) {
                    if (!user) {
                        return res.redirect('/forgot');
                    }
                    done(err, token, user);
                });
            },
            // 
            function(token, user, done) {
                var passwordResetRequest = new PasswordResetRequestModel();
                passwordResetRequest.userId = user._id;
                passwordResetRequest.hash = crypto.createHash('sha256').update(token).digest('hex');
                passwordResetRequest.save(function(err) {
                    done(err, token, user);
                });
            },
            // Send email
            function(token, user, done) {
                // TODO in the future, we have to use SMTP transport instead of direct transport.
                var transporter = nodemailer.createTransport(secrets.mailClient.service);
                var mailOptions = {
                    to: user.email,
                    from: secrets.mailClient.email,
                    subject: 'Reset your password',
                    text: 'http://localhost:3000/reset/' + token
                };
                transporter.sendMail(mailOptions, function(err) {
                    done(err, 'done');
                });
            }
        ], function(err) {
            if (err) {
                return next(err);
            }
            res.redirect('/forgot');
        });
    });

    app.get('/reset/:token', function(req, res) {
        var tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
        PasswordResetRequestModel.findOne({ hash: tokenHash }, function(err, passwordResetRequest) {
            // request not made or token expired.
            if (!passwordResetRequest) {
                return res.redirect('/forgot');
            }
            res.render('user/reset.jade');
        });
    });

    app.post('/reset/:token', function(req, res) {
        async.waterfall([
            function(done) {
                if (req.body.password != req.body.confirm) {
                    return res.redirect('back');
                }
                var tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
                PasswordResetRequestModel.findOne({ hash: tokenHash }, function(err, passwordResetRequest) {
                    // request not made or token expired.
                    if (!passwordResetRequest) {
                        return res.redirect('/forgot');
                    }
                    done(err, passwordResetRequest);
                });
            },
            function(passwordResetRequest, done) {
                UserModel.findOne({ _id: passwordResetRequest.userId }, function(err, user) {
                    if (!user) {
                        return res.redirect('back');
                    }
                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(req.body.password, salt, function(err, hash) {
                            user.hash = hash;
                            user.save(function(err) {
                                req.login(user, function(err) {
                                    done(err, user);
                                });
                            });
                        });
                    });
                });
            },
            function(user, done) {
                var smtpTransport = nodemailer.createTransport(secrets.mailClient.service);
                var mailOptions = {
                    to: user.email,
                    from: secrets.mailClient.email,
                    subject: 'Your password has been changed',
                    text: 'Password for ' + user.email + ' has just been changed.'
                };
                smtpTransport.sendMail(mailOptions, function(err) {
                    done(err);
                });
            }
        ], function(err) {
            res.redirect('/');
        });
    });

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

    app.get('/logout', function (req,res) {
        // Call passport request.logout()
        req.logout();
        // Redirect page
        res.redirect('/login');
    });

    app.get('/user/edit', function (req, res) {
        if (!req.isAuthenticated()) {
            return res.redirect('/login');
        }

        return UserModel.findById(req.user.id, function (err, user) {
            if (!err) {
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

                UserModel.findOneAndUpdate({_id: req.session.uid}
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
            UserModel.findOneAndUpdate(
                  { _id: req.user.id }
                , { $set: { username: req.body.username
                          }
                  }, function (err, profile) {
                    res.redirect('/user');
                }
            );
        }
    });

    // Upload images for House
    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart();
    app.post('/user/avatar', multipartMiddleware, function (req, res) {
        if (!req.isAuthenticated()) {
            res.redirect('/login');
        }

        if (req.files) {
            var tmpPath = req.files['photo'].path;
            var oldName = req.files['photo'].name;
            var uid = req.user.id;

            // Get the file extension
            var extension = oldName.substring(oldName.lastIndexOf('.'), oldName.length);
            var imageObj = new models.ImageModel({
                title: 'uid',
                extension: extension
            });


            // Maybe we can create a better function and put it inside image model
            // Store image info into db
            imageObj.save(function (err, image) {
                // Distination Directory
                var dstDir = app.get('application_root') + '/uploads/avatar/' + uid + '/';
                // mkdir
                fs.mkdirSync(dstDir, 0777, true);
                _.each(image.formats, function (imageFormat) {
                    var srcPath = tmpPath;
                    var dstPath = dstDir + imageFormat.name + extension;
                    var width = imageFormat.size;

                    // Resize the image
                    im.resize({
                        srcPath: srcPath,
                        dstPath: dstPath,
                        width: width,
                        quality: 0.9
                    }, function (err, stdout, stderr) {
                        console.log(dstPath);
                        if (!err) {
                            // do nothing
                        } else {
                            // return res.redirect('/user/edit');
                        }
                    });
                });

                // Save Avatar to User
                UserModel.findOneAndUpdate(
                      { _id: uid }
                    , { $set: { avatar: { _id: image._id,
                                          extension: image.extension
                                        }
                              }
                      }, function (err, user) {
                        return res.redirect('/user/' + uid);
                    }
                );
            });
        } else {
            res.send("No file provided");
        }
    });

    app.get('/user', function (req, res) {
        return res.redirect('/user/' + req.user.id);
    });

    app.get('/user/:id', function (req, res) {
        var uid = req.params.id;
        if (uid == undefined) {
            if (req.isAuthenticated()) {
                uid = req.user.id;
            } else{
                return res.redirect('/login');
            }
        }
        console.log(uid);
        UserModel.findById(uid, function (err, user) {
            if (!err) {
                console.log(user);
                var profile = user.getProfile();
                profile.canEdit = req.user && req.user.id == uid;
                return res.render('user/view.jade', {profile: profile});
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