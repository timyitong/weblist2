module.exports = function(app) {
    var _ = require('underscore');
    var models = app.models;
    
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
    })

    return this;
}