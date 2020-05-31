const userCtrl = {};
const user = require('../models/users');
const passport = require('passport');

userCtrl.renderSignUpForm = (req, res) => {
    res.render('./users/signUp');
};
userCtrl.signUp = async (req, res) => {
    const errors = [];
    const {name, email, password, confirmPassword } = req.body;
    if (password != confirmPassword) {
        errors.push({text:'Password do not match.'}); 
       
    }
    if (password.length < 5) {
        errors.push({text:'Password should have atleast 6 characters.'});
    }
    if (errors.length>0) {
        res.render('./users/signUp', {errors})
    } else {
        const userEmail = await user.findOne({email:email})
        if (userEmail) {
            req.flash('error', 'This email is already in use.');
            res.redirect('/auth/signup');
        } else {
            const newUser = new user({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success', 'Your account was registered!');
            res.redirect('/auth/login')
        }
    }
    
};
userCtrl.renderSignInForm = (req, res) => {
    res.render('./users/logIn');
};
userCtrl.logIn = passport.authenticate('local',{
    failureRedirect: '/auth/login',
    successRedirect: '/board',
    failureFlash:true,
    successFlash: 'Welcome back! '
});

userCtrl.logOut = (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/');
}

module.exports = userCtrl;