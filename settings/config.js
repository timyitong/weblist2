module.exports = function(app) {
    // Import Modules
    var bodyParser = require('body-parser'),
        cookieParser = require('cookie-parser'),
        errorhandler = require('errorhandler'),
        express = require('express'),
        passport = require('passport'),
        session = require('express-session'),
        RedisStore = require('connect-redis')(session),
        methodOverride = require('method-override'),
        morgan = require('morgan');
    // Constants
    var env = process.env.NODE_ENV || 'development',
        application_root = app.get('application_root');

    /* Setting Middlewares via app.use()
     *
     * ORDER IS VERY IMPORTANT!
     */

    // HTTP REQUEST logger
    if (env != 'development') {
        app.use(morgan('combined'));
    }

    // Body Parser, making req.body getting json data in specific content types:
        // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));
        // parse application/json
    app.use(bodyParser.json());

    // Cookie Parser, TODO: do we really need this? Because we are using sessions
    app.use(cookieParser());
    // Session, maxAge: 1 week, use Redis for storage
    app.use(session({ secret: 'olalalala', 
//                      store: new RedisStore(
//                        {url: 'redis://127.0.0.1:6379/weblist2_session_storage'}
//                      ),
                      store: new session.MemoryStore,
                      cookie: { maxAge: 7*24*60*60*1000 },
                      resave: true,
                      saveUninitialized: true
                    }));

    /* Method override, making you see PUT/DELETE
     *  when the client does not support it.
     */
    // TODO: tentative putting here. Should it before bodyParser or after?

    // Override with different headers; last one takes precedence.
    app.use(methodOverride('X-HTTP-Method'))          // Microsoft
    app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
    app.use(methodOverride('X-Method-Override'))      // IBM

    // Set up Passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Static Server (GET /static/style.css, GET /static/favicon.ico)
    app.use(express.static(application_root + '/static'));

    ///////
        // Something we can try:
        // app.post('*', requireAuthentification, loadUser);
    ///////

    require('../auth/passport');

    // IMPORTANT! Bind all major routers!
    var mainRouter = require('./routes');
    mainRouter(app);

    // Error Handler, after everything is done:
    if (env == "development") {
        app.use(errorhandler());
    }
}