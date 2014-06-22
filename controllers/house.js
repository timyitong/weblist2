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
        res.render('house/new.jade', {});
    });

    app.post('/house/save', function (req, res) {
        var house = new models.HouseModel({
            title : req.body.title,
            description : req.body.description,
            price : req.body.price
        });

        house.save(function (err) {
            if (!err) {
                res.redirect('/house/view/' + house._id);                
            } else {
                res.redirect('/');
            }
        });
    });

    function rename_image(tmp_path, old_name, folder, size){
        var new_name=tmp_path.substring(tmp_path.lastIndexOf('/') + 1, tmp_path.length);
                     // + old_name.substring(old_name.lastIndexOf('.'), old_name.length)
        var new_path="./"+"static/"+folder+"/"+new_name;
        var new_url="/"+folder+"/"+new_name;
        console.log(new_path);
        app.fs.rename(tmp_path,new_path,function(err){
            if (err) throw err 
            // app.fs.unlink(tmp_path);
            resize_image(new_path,size)
        })

        return new_url
    }

    function resize_image(image, width){
        console.log("###" + image);
        console.log("###" + width);
      var options={
        srcPath: image,
        dstPath: image,
        width:  width,
        quality: 0.9
      }
      app.im.resize(options,function(err){
        if (!err) return console.log("resized")
        else console.log(err)
      })
    }

    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart();

    app.post('/house/photoupload/:id', multipartMiddleware, function (req, res) {
        console.log(req.files);
        if (req.files) {
            var tmp=req.files['photo'].path;
            var old=req.files['photo'].name;
            image=rename_image(tmp, old, "uploads",190);
       
            models.HouseModel.findByIdAndUpdate(ObjectId(req.params.id), { $push: {photos: image} }, function (err, house) {
                res.redirect('/house/view/' + house._id);
            });
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
