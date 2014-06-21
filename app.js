// Init Application
var express = require('express');
var app = express();

// root dir name of the repo
app.application_root = __dirname;

app.everyauth =  require('everyauth');

app.im = require('imagemagick');
app.fs = require('node-fs');
app.path = require("path");
app.mongoose = require("mongoose")
app.moment = require('moment')

// Moment setip
app.moment.relativeTime={
    future: "in %s",
    past: "%s ago",
    s:"1 second",
    ss: "%d seconds",
    m: "1 minute",
    mm: "%d minutes",
    h: "1 hour",
    hh: "%d hours",
    d: "1 day",
    dd: "%d days",
    M: "1 month",
    MM: "%d months",
    y: "1 year",
    yy: "%d years"
}

// Include constants file
var constants = require("./utils/constants");

// Include config file
var config = require('./settings/config')(app, express);

// Include models file
app.models = require("./settings/models")(app);

// Include the controller file
require('./settings/routes')(app);

// Start server
var port = process.env.PORT || 3000;
app.listen(port);
console.log("Listening on port " + port);
