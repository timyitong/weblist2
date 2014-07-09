module.exports = function(app) {
    var _ = require('underscore');
    var models = app.models;
    var ObjectId=app.mongoose.Types.ObjectId;

    app.get('/house/view/:id', function (req, res) {
        return models.HouseModel.findOne({_id: req.params.id},
                                        function(err, house){
                    res.render('house/view.jade', {house: house});
                });
    });

    app.get('/houses', function (req, res) {
        return models.HouseModel.find(function(err, houses) {
            if (!err) {
                return res.render('house/list.jade', {houses: houses});
            }
        });
    });

    app.get('/house/new', function (req, res) {
        if (req.session.authenticated) {
            console.log('hit new house page.');
            res.render('house/new.jade', {});
        } else {
            res.redirect('/signin');
        }
    });

    app.post('/house/save', function (req, res) {
        var house = new models.HouseModel({
            title : req.body.title,
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
            }

        });

        house.save(function (err) {
            if (!err) {
                res.redirect('/house/view/' + house._id);                
            } else {
                res.redirect('/');
            }
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
                        res.redirect('/house/view/' + house._id);
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

    return this;
}
