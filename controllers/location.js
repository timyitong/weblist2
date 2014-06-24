module.exports = function(app) {

    var models = app.models;

    app.get('/countries', function (req, res) {

        var query = models.CountryModel.find().select('name name_i18n code -_id');
        query.exec(function (err, countries) {
            res.format({
                'text/plain': function() {
                    if (err) {
                        res.send(500, { message: 'Error'});
                    } else {
                        res.send(countries);
                    }
                },

                'text/html': function() {
                    if (err) {
                        res.send(500, { message: 'Error'});
                    } else {
                        res.send(countries);
                    }
                },

                'application/json': function() {
                    if (err) {
                        res.send(500, { message: 'Error'});
                    } else {
                        res.send(countries);
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
                        res.send(500, { message: 'Error'});
                    } else {
                        res.send(regions);
                    }
                },

                'text/html': function() {
                    if (err) {
                        res.send(500, { message: 'Error'});
                    } else {
                        res.send(regions);
                    }
                },

                'application/json': function() {
                    if (err) {
                        res.send(500, { message: 'Error'});
                    } else {
                        res.send(regions);
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
                        res.send(500, { message: 'Error'});
                    } else {
                        res.send(cities);
                    }
                },

                'text/html': function() {
                    if (err) {
                        res.send(500, { message: 'Error'});
                    } else {
                        res.send(cities);
                    }
                },

                'application/json': function() {
                    if (err) {
                        res.send(500, { message: 'Error'});
                    } else {
                        res.send(cities);
                    }
                }
            })
        });
    });

    return this;
}