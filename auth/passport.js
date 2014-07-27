var _ = require('underscore'),
    bcrypt = require('bcrypt'),
    ObjectId = require('mongoose').Schema.Types.ObjectId,
    // passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    UserModel = require('../settings/models').UserModel,
    secrets = require('../config/secrets'),
    stringUtils = require('../utils/stringUtils');

module.exports = function (passport) {

    /* Required for persistent login sessions
     * passport needs ability to serialize and unserialize users out of session
     *
     */
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        UserModel.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // Sign in using Email and Password.

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        // This does not mean the stored field, but the frontend field!!!
        passwordField: 'password',
        // This field seems to be important
        passReqToCallback: true
    }, function(req, email, password, done) {
        if (!stringUtils.validEmail(email)) {
            return done(null, false, {message: "Invalid email address"});
        }

        UserModel.findOne({ email: email }, function(err, user) {
            if (err) {
                return done(err);
            }

            if (user) {
                return done(null, false);
            }

            if (req.user) {
                // TODO: this part will cause password update bug!
                var user = req.user;
                user.email = email;
                user.password = password;
                user.save(function(err) {
                    if (err) {
                        throw err;
                    }
                    return done(null, user);
                });
            } else {
                // Create Hash, and then create the user
                // Async style
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(password, salt, function(err, hash) {
                        if (err) {
                            return done(err);
                        }

                        // Extract username from email:
                        var username = stringUtils.extractNameFromEmail(email);

                        // Create and save new instance
                        UserModel.create({
                            email: email,
                            hash: hash,
                            username : username
                        }, function(err, user) {
                            if (err) {
                                return done(err);
                            }
                            return done(null, user);
                        });
                    });
                });
            }
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        // This literally allow the req in the below function
        passReqToCallback: true
    }, function(req, email, password, done) {
        UserModel.findOne({ email: email }, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, { message: 'Email ' + email + ' not found'});
            }
            
            return user.validPassword(password, done);
        });
    }));

    // Sign in with Facebook.

    passport.use(new FacebookStrategy(secrets.facebook, function(req, accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            if (req.user) {
                UserModel.findOne({ 'facebook.id': profile.id }, function(err, existingUser) {
                    if (existingUser) {
                        done(err);
                    } else {
                        UserModel.findById(req.user.id, function(err, user) {
                            user.facebook.id = profile.id;
                            user.facebook.accessToken = accessToken;
                            user.facebook.name = profile.displayName;
                            user.facebook.email = profile._json.email;
                            user.facebook.firstName = profile.name.givenName;
                            user.facebook.lastName = profile.name.familyName;
                            user.save(function(err) {
                                done(err, user);
                            });
                        });
                    }
                });
            } else {
                UserModel.findOne({ 'facebook.id': profile.id }, function(err, existingUser) {
                    if (err) {
                        return done(err);
                    }
                    if (existingUser) {
                        return done(null, existingUser);
                    }
                    UserModel.findOne({ email: profile._json.email }, function(err, existingEmailUser) {
                        if (existingEmailUser) {
                            done(err);
                        } else {
                            var user = new UserModel();
                            user.facebook.id = profile.id;
                            user.facebook.accessToken = accessToken;
                            user.facebook.name = profile.displayName;
                            user.facebook.email = profile._json.email;
                            user.facebook.firstName = profile.name.givenName;
                            user.facebook.lastName = profile.name.familyName;
                            user.save(function(err) {
                                done(err, user);
                            });
                        }
                    });
                });
            }
        });
    }));

    // Sign in with Twitter.

    passport.use(new TwitterStrategy(secrets.twitter, function(req, accessToken, tokenSecret, profile, done) {
        process.nextTick(function() {
            if (req.user) {
                UserModel.findOne({ 'twitter.id': profile.id }, function(err, existingUser) {
                    if (existingUser) {
                        done(err);
                    } else {
                        User.findById(req.user.id, function(err, user) {
                            user.twitter.id = profile.id;
                            user.twitter.email = profile.username + "@twitter.com";
                            user.twitter.accessTokens = accessToken;
                            user.twitter.tokenSecret = tokenSecret;
                            user.twitter.username = profile.username;
                            user.twitter.displayName = profile.displayName;
                            user.save(function(err) {
                                done(err, user);
                            });
                        });
                    }
                });

            } else {
                UserModel.findOne({ 'twitter.id': profile.id }, function(err, existingUser) {
                    if (existingUser) {
                        return done(null, existingUser);
                    }
                    var user = new UserModel();
                    user.twitter.id = profile.id;
                    user.twitter.email = profile.username + "@twitter.com";
                    user.twitter.accessTokens = accessToken;
                    user.twitter.tokenSecret = tokenSecret;
                    user.twitter.username = profile.username;
                    user.twitter.displayName = profile.displayName;
                    user.save(function(err) {
                        done(err, user);
                    });
                });
            }
        });
    }));

    // Sign in with Google.

    passport.use(new GoogleStrategy(secrets.google, function(req, accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            if (req.user) {
                UserModel.findOne({ 'google.id': profile.id }, function(err, existingUser) {
                    if (existingUser) {
                        done(err);
                    } else {
                        UserModel.findById(req.user.id, function(err, user) {
                            user.google.id = profile.id;
                            user.google.accessToken = accessToken;
                            user.google.name = profile.displayName;
                            user.google.email = profile._json.email;
                            user.save(function(err) {
                                done(err, user);
                            });
                        });
                    }
                });
            } else {
                UserModel.findOne({ 'google.id': profile.id }, function(err, existingUser) {
                    if (existingUser) {
                        return done(null, existingUser);
                    }
                    UserModel.findOne({ email: profile._json.email }, function(err, existingEmailUser) {
                        if (existingEmailUser) {
                            done(err);
                        } else {
                            var user = new UserModel();
                            user.google.id = profile.id;
                            user.google.accessToken = accessToken;
                            user.google.name = profile.displayName;
                            user.google.email = profile._json.email;
                            user.save(function(err) {
                                done(err, user);
                            });
                        }
                    });
                });
            }
        });
    }));
}

// // Login Required middleware.

// TODO make a different export
// exports.isAuthenticated = function(req, res, next) {
//     if (req.isAuthenticated()) return next();
//     res.redirect('/login');
// };

// // Authorization Required middleware.

// exports.isAuthorized = function(req, res, next) {
//     var provider = req.path.split('/').slice(-1)[0];

//     if (_.find(req.user.tokens, { kind: provider })) {
//         next();
//     } else {
//         res.redirect('/auth/' + provider);
//     }
// };