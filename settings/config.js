module.exports = function(app, express){
    var config=this;
    var expressValidator = require('express-validator');

    app.configure(function () {
        // view engine
        app.set('views', app.application_root + '/views');
        app.set('view engine','jade');
        app.set('view options', {
            layout:  true
        });

        // express
        var methodOverride = require("method-override");
        app.use(methodOverride());


        app.use(express.cookieParser("csecstring"));
        app.use(express.session({
            secret: 'topsecret',
            store: new express.session.MemoryStore
        }));

        app.use(app.passport.initialize());
        app.use(app.passport.session());
        app.use(function(req, res, next) {
            // Make user object available in templates.
            res.locals.user = req.user;
            next();
        });
        // remember original destination before login.
        app.use(function(req, res, next) {
            var path = req.path.split('/')[1];
            if (/auth|login|logout|signup|fonts|favicon|css|javascript/i.test(path)) {
                return next();
            }
            req.session.returnTo = req.path;
            next();
        });
        app.use(express.static(app.path.join(app.application_root,
                                             "static")));
        app.use(express.errorHandler({
            dumpExceptions:  true,
            showStack:  true
        }));

        // @deprecated        
        // app.use(express.bodyParser({
        //     keepExtensions:  true,
        //     uploadDir:  "./static/uploads"
        // }));
        app.use(express.urlencoded());
        app.use(express.json());
        app.use(expressValidator());
        app.use(function (req, res, next) {
            if (req.cookies.uid != undefined && req.cookies.uid != 'undefined') {
                req.session.uid = req.cookies.uid;
            }
            if (req.session.uid == undefined) {
                req.session.authenticated = false;
            } else {
                req.session.authenticated = true;
            }
            res.locals.session = req.session;
            next();
        });

        // router
        app.use(app.router);
    });

    // DB Config
    app.mongoose.connect('mongodb://localhost:27017/weblist2');

    return config;
}