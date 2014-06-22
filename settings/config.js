module.exports = function(app, express){
    var config=this;

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

        // everyauth
        app.use(app.everyauth.middleware());

        // router
        app.use(app.router);
    });

    // DB Config
    app.mongoose.connect('mongodb://localhost:27017/weblist2');

    return config;
}