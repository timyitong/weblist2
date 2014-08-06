module.exports = function(app) {
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjectId = Schema.Types.ObjectId;

    /**
     * Get page to write new message.
     */
    app.get('/messages/new', function(req, res) {

    });

    /**
     * Save/update a message.
     */
    app.post('/messages/save/:id', function(req, res) {

    });

    /**
     * Send a new message.
     */
    app.post('/messages/send/:id', function(req, res) {

    });

    /**
     * Show messages in inbox
     */
    app.get('/messages/inbox', function(req, res) {

    });

    /**
     * Show messages from specific user in inbox.
     */
    app.get('/messages/inbox/:userId', function(req, res) {

    });

    /**
     * Show message drafts.
     */
    app.get('/messages/drafts', function(req, res) {

    });

    /**
     * Show a message draft.
     */
    app.get('/messages/drafts/:id', function(req, res) {

    });

    /**
     * Show sent messages.
     */
    app.get('/messages/sent', function(req, res) {

    });

    /**
     * Show sent messages to specific user.
     */
    app.get('/messages/sent/:userId', function(req, res) {

    });

    return this;
}