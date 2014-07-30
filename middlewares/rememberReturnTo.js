module.exports = function (req, res, next) {
    var path = req.path.split('/')[1];
    if (/auth|login|logout|signup|fonts|favicon|css|javascript|images/i.test(path)) {
        return next();
    }
    res.locals.returnTo = req.path;
    console.log(res.locals.returnTo);
    next();
}