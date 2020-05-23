const auth = {}

auth.isAuthenticated = (req,res,next) => {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You have to log in first.' );
    res.redirect('/auth/login');
}

auth.isNotAuthenticated = (req, res,next) => {
    if (!req.isAuthenticated()){
        return next();
    }
    req.flash('warning', 'You are already logged in to an account.');
    res.redirect('/');
}

module.exports = auth;