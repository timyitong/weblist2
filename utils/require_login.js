module.exports = function(req, res, next) {
    var isAuthenticated;

    if (req.cookies.uid != undefined && req.cookies.uid != "undefined") {
        req.session.uid = req.cookies.uid;
    }
    
    if (req.session.uid == undefined) {
        isAuthenticated = false;
    } else {
        isAuthenticated = true;
    }

    if (isAuthenticated){
        next();
    } else {
        res.redirect('/');
    }

    return this;
}