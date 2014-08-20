module.exports = function(app) {
    var async = require('async'),
        mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        ObjectId = Schema.Types.ObjectId,
        models = require('../settings/models');

    var MessageModel = models.MessageModel;
    var NotificationModel = models.NotificationModel;
    var UserModel = models.UserModel;

    /**
     * Send a new message.
     */
    app.post('/message', function (req, res) {
        if (!req.isAuthenticated()) {
            return res.redirect('/login');
        }
        async.waterfall([
            // Save new message.
            function (done) {
                var message = new MessageModel({
                    messageType: 'userMessage',
                    body: req.body.message,
                    sender: ObjectId(req.user.id),
                    recipient: ObjectId(req.body.recipientId)
                });
                message.save(function (err, newMessage) {
                    done(err, newMessage);
                });
            },
            // Save new notification.
            function (newMessage, done) {
                var notification = new NotificationModel({
                    notificationType: 'userMessage',
                    recipient: ObjectId(req.body.recipientId),
                    contentId: newMessage._id
                });

                notification.save(function (err) {
                    done(err, 'done');
                });
            }
        ], function (err) {
            if (err) {
                return next(err);
            }
            res.send(400, { message: 'Failed to send message.'});
        });
    });

    return this;
}