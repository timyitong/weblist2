/* Weblist2
 *
 * @author: Haochen Wei, Yitong Zhou
 */

// Import Modules And Create Express Instance
var autoIncrement = require('mongoose-auto-increment'),
    express = require('express'),
    jade = require('jade'),
    mongoose = require('mongoose'),
    app = express();


/* All Application Settings (which you use app.set)
 * 
 * BTW, to access these settings in views, use settings./foo/ in view templates.
 * Use app.locals.foo = bar, if foo is not suitable under 'settings' object
 */

// Site Title
app.set('title', 'BlaBla');

// Application Root Directory
app.set('application_root', __dirname);

// Set view template root
app.set('views', app.get('application_root') + '/views');
// Set .jade as default template extension
app.set('view engine','jade');
// Set jade as the template engine for .jade
app.engine('jade', jade.__express);
app.set('view options', {layout:  true});
/****************************************/


/* ALL APPLICATION MIDDLEWARE CONFIGS (mostly if you use app.use()) 
 * GOES TO ./settings/config.js
 */
var config = require('./settings/config');
config(app);
/****************************************/


/* Database Settings
 *
 */
// DB Config
mongoose.connect('mongodb://localhost:27017/weblist2');
// Init Schema Table for mongoose-auto-increment
// autoIncrement.initialize(connection);
/****************************************/


/* Prepare to START the server! */
var port = process.env.PORT || 3000;
app.listen(port);
console.log("Listening on port " + port);

// TODO: move this configure passport
require('./auth/passport');
/****************************************/