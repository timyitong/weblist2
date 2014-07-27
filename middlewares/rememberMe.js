module.exports = function (req, res, next) {
    if ( req.method == 'POST' && req.url == '/login' ) {
      if ( req.body.rememberme ) {
        // 30*24*60*60*1000 Rememeber 'me' for 30 days
        timedelta = 2592000000;
        req.session.cookie.expires = new Date(Date.now() + timedelta);
        req.session.cookie.maxAge = timedelta; 
      } else {
        req.session.cookie.expires = false;
      }
    }
    next();
}