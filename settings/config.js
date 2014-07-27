module.exports = function(app) {
    // Import Modules
    var bodyParser = require('body-parser'),
        errorhandler = require('errorhandler'),
        express = require('express'),
        passport = require('passport'),
        session = require('express-session'),
        RedisStore = require('connect-redis')(session),
        methodOverride = require('method-override'),
        morgan = require('morgan'),
        LocalStrategy = require('passport-local').Strategy;

    // Our Middlewares
        rememberReturnTo = require('../middlewares/rememberReturnTo');
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

    // Session, maxAge: 1 week, use Redis for storage
    var sessionStore = new session.MemoryStore;
    if (env != 'development') {
      sessionStore = new RedisStore(
        {url: 'redis://127.0.0.1:6379/weblist2_session_storage'}
      );
    }
    app.use(session({   secret: "olalalala", 
                        store: sessionStore,
                        // cookie: { maxAge: 7*24*60*60*1000 },
                        resave: true,
                        saveUninitialized: true
                    }));
    // app.use(cookieSession({keys:['key1', 'key2']}));

    /* Enable locals.messages system:
     *  a. Access messages through locals.messages.[fieldName]
     *  b. Define flashy message through:
     *       req.flashy('[fieldName]', 'Message')
     */
    // app.use(flashy());

    /* Method override, making you see PUT/DELETE when the client
     * does not support it.
     *
     * TODO: tentative putting here. Should it before bodyParser or after?
     */
    // Override with different headers; last one takes precedence.
    app.use(methodOverride('X-HTTP-Method'))          // Microsoft
    app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
    app.use(methodOverride('X-Method-Override'))      // IBM

    // remember original destination before login.
    app.use(rememberReturnTo);
    
    require('../auth/passport')(passport);
    // Set up Passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Static Server (GET /static/style.css, GET /static/favicon.ico)
    app.use(express.static(application_root + '/static'));
    app.use(express.static(application_root + '/uploads'));

    // Bind req.user to res.locals which is accessible from view templates
    // TODO: is there any way neater to do it?
    app.use(function(req, res, next){
      res.locals.user = req.user;
      res.locals.authenticated = ! req.user;
      next();
    });

    ///////
        // Something we can try:c
        // app.post('*', requireAuthentification, loadUser);
    ///////

    // IMPORTANT! Bind all major routers!
    var mainRouter = require('./routes');
    mainRouter(app);

    // Error Handler, after everything is done:
    if (env == "development") {
        app.use(errorhandler());
    }
}