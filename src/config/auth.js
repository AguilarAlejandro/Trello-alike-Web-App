const auth = {}

auth.isAuthenticated = (req,res,next) => {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You have to log in first.' );
    res.redirect('/auth/login');
}

module.exports = auth;