module.exports = function(app) {

    var models = app.models;

    app.get('/countries', function (req, res) {
        var query = models.CountryModel.find().select('name name_i18n code -_id');
        query.exec(function (err, countries) {
            res.format({
                'text/plain': function() {
                    if (err) {
                        res.send(400, { message: 'Error'});
                    } else {
                        res.send({ countries: countries });
                    }
                },

                'text/html': function() {
                    if (err) {
                        res.send(400, { message: 'Error'});
                    } else {
                        res.send({ countries: countries });
                    }
                },

                'application/json': function() {
                    if (err) {
                        res.send(400, { message: 'Error'});
                    } else {
                        res.send({ countries: countries });
                    }
                }
            })
        });
    });

    app.get('/regions/:country_code', function (req, res) {
        var query = models.RegionModel.find({ country_code: req.params.country_code }).select('name name_i18n code -_id');
        query.exec(function (err, regions) {
            res.format({
                'text/plain': function() {
                    if (err) {
                        res.send(400, { message: 'Error'});
                    } else {
                        res.send({ regions: regions });
                    }
                },

                'text/html': function() {
                    if (err) {
                        res.send(400, { message: 'Error'});
                    } else {
                        res.send({ regions: regions });
                    }
                },

                'application/json': function() {
                    if (err) {
                        res.send(400, { message: 'Error'});
                    } else {
                        res.send({ regions: regions });
                    }
                }
            })
        });
    });

    app.get('/cities/:region_code', function (req,res) {
        var query = models.CityModel.find({ region_code: req.params.region_code }).select('name name_i18n code -_id');
        query.exec(function (err, cities) {
            res.format({
                'text/plain': function() {
                    if (err) {
                        res.send(400, { message: 'Error'});
                    } else {
                        res.send({ cities: cities });
                    }
                },

                'text/html': function() {
                    if (err) {
                        res.send(400, { message: 'Error'});
                    } else {
                        res.send({ cities: cities });
                    }
                },

                'application/json': function() {
                    if (err) {
                        res.send(400, { message: 'Error'});
                    } else {
                        res.send({ cities: cities });
                    }
                }
            })
        });
    });

    return this;
}