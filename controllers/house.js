module.exports = function(app) {
    var _ = require('underscore'),
        models = require('../settings/models'),
        ObjectId = require('mongoose').Schema.Types.ObjectId,
        stringUtils = require('../utils/stringUtils');

    app.get('/houses', function (req, res) {
        var query = {};

        // TODO a simple one keyword search support, should switch to SE solutions, later on
        if (req.query.keyword) {
            query.title = new RegExp(req.query.keyword, 'i');
        }

        return models.HouseModel.find(query, function(err, houses) {
            res.format({
                'text/plain': function() {
                    if (err) {
                        res.send(400, { message: 'Error' });
                    } else {
                        return res.render('house/list.jade', {houses: houses});
                    }
                },

                'text/html': function() {
                    if (err) {
                        res.send(400, { message: 'Error' });
                    } else {
                        return res.render('house/list.jade', {houses: houses});
                    }
                },

                'application/json': function() {
                    if (err) {
                        res.send(400, { message: 'Error'});
                    } else {
                        res.send({ houses: houses });
                    }
                }
            });
        });
    });

    app.get('/house/new', function (req, res) {
        if (req.session.authenticated) {
            var query = models.CountryModel.find().select('name name_i18n code -_id');
            query.exec(function (err, countries) {
                if (err || countries == undefined) {
                    res.redirect('/');
                }
                res.render('house/new.jade', { countries: countries });
            });
        } else {
            res.redirect('/login');
        }
    });

    app.post('/house', function (req, res) {
        return models.CountryModel.findOne({ code: req.body.country }, function (err, country) {
            if (err || country == undefined) {
                return res.send('Country not found');
            }
            return models.RegionModel.findOne({ code: req.body.region, country_code: req.body.country }, function (err, region) {
                if (err || region == undefined) {
                    return res.send('Region not found');
                }
                return models.CityModel.findOne({ code: req.body.city, region_code: req.body.region }, function (err, city) {
                    if (err || city == undefined) {
                        return res.send('City not found');
                    }
                    var geoLocation = {
                        latitude: req.body.latitude,
                        longitude: req.body.longitude
                    };
                    var house = new models.HouseModel({
                        title : stringUtils.toTitleCase(req.body.title),
                        description : req.body.description,
                        price : {
                            value : req.body.price,
                            unit : '$'
                        },
                        bedroomNum : req.body.bedroomNum,
                        bathroomNum : req.body.bathroomNum,
                        lavatoryNum : req.body.lavatoryNum,
                        houseTypes : [req.body.houseTypes],
                        builtIn : req.body.builtIn,
                        areaSize : {
                            value : req.body.areaSize,
                            unit : 'sqft'
                        },

                        // location info
                        country: country._id,
                        region: region._id,
                        city: city._id,
                        street: req.body.street,
                        building: req.body.building,
                        zipCode: req.body.zipCode,
                        geoLocation: geoLocation
                    });

                    house.save(function (err) {
                        if (!err) {
                            res.redirect('/house/' + house._id);                
                        } else {
                            res.redirect('/');
                        }
                    });
                });
            });
        });
    });

    // Upload images for House
    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart();
    app.post('/house/photoupload/:id', multipartMiddleware, function (req, res) {
        console.log(req.files);
        if (req.files) {
            var tmpPath = req.files['photo'].path;
            var oldName = req.files['photo'].name;

            var title = req.body.title;
            // Get the file extension
            var extension = oldName.substring(oldName.lastIndexOf('.'), oldName.length);
            var imageObj = new models.ImageModel({
                title: title,
                extension: extension
            });

            // Store image info into db
            imageObj.save(function (err, image) {
                // Distination Directory
                var dstDir = app.application_root + '/static/uploads/' + image._id + "/";
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
                    }, function (err) {
                        if (!err) {
                            return console.log("resized");
                        } else {
                            console.log(err);
                        }
                    });

                });

                models.HouseModel.findByIdAndUpdate(ObjectId(req.params.id)
                    , { $push: { images: {
                                           _id: image._id,
                                           extension: image.extension
                                         } 
                               }
                    }, function (err, house) {
                        res.redirect('/house/' + house._id);
                    }
                );
            });

        } else {
            res.send("No file provided");
        }
    });

    app.get('/house/delete/:id', function (req, res) {
        models.HouseModel.findByIdAndRemove(ObjectId(req.params.id), function (err, house) {
            if (!err) {
                return res.redirect('/houses');
            } else {
                return res.redirect('/');
            }
        });
    }); 


    app.get('/house/:id', function(req, res) {
        return models.HouseModel.findOne({ _id: req.params.id }).populate('comments.fromUser').exec(function(err, house) {
            // Sanitize House data
            house.description = stringUtils.toHtmlParagraph(house.description);

            res.format({
                'text/plain': function() {
                    res.render('house/view.jade', {house: house});
                },

                'text/html': function() {
                    res.render('house/view.jade', {house: house});
                },

                'application/json': function() {
                    if (err) {
                        res.send(400, { message: 'Error'});
                    } else {
                        res.send({ house: house });
                    }
                }
            });
        });
    });

    app.post('/house/comment', function (req, res) {
        return models.HouseModel.findOne({_id: ObjectId(req.body.parentId)}, function(err, house) {
            if (house) {
                console.log(req.session.uid);
                house.comments.push({parentId: house._id, fromUser: ObjectId(req.session.uid), text: req.body.text});

                house.save(function (err, house) {
                  if (err) {

                  } else {
                    res.format({
                        'text/plain': function() {
                            res.redirect('/house/'+house._id);
                        },

                        'text/html': function() {
                            res.redirect('/house/'+house._id);
                        },

                        'application/json': function() {
                            if (err) {
                                res.send(400, { message: 'Error'});
                            } else {
                                res.send({ house: house });
                            }
                        }
                    });
                  }

                });
            }
        });
    });

    return this;
}
