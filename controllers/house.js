module.exports = function(app) {

    app.get('/house/view/:id', function (req, res) {
        res.render('house/view.jade', {id:"Welcome to haha"});
    });

    app.get('/houses', function (req, res) {
        res.render('house/list.jade', {id: "hahaha"});
    });

    app.get('/house/new', function (req, res) {
        if (req.session.authenticated) {
            console.log('hit new house page.');
            res.render('house/new.jade', {});
        } else {
            res.redirect('/signin');
        }
    })

    return this;
}