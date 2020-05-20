const userCtrl = {};
const user = require('../models/users');

userCtrl.renderSignUpForm = (req, res) => {
    res.render('./users/signUp');
};
userCtrl.signUp = async (req, res) => {
    var er=0;
    const {name, email, password, confirmPassword } = req.body;
    if (password != confirmPassword) {
        req.flash('error', 'Password do not match.'); 
        er++;
    }
    if (password.length < 5) {
        req.flash('error', 'Password should have atleast 6 characters.');
        er++;
    }
    if (er > 0) {
        res.redirect('/auth/signUp')
    } else {
        const userEmail = await user.findOne({email:email})
        if (userEmail) {
            req.flash('error', 'This email is already in use.');
            res.redirect('/auth/signup');
        } else {
            const newUser = new user({name, email, password});
            await newUser.save();
            console.log('New user is');
            console.log(newUser);
            res.redirect('/auth/login')
        }
    }
    
};
userCtrl.renderSignInForm = (req, res) => {
    res.render('./users/logIn');
};
userCtrl.logIn = (req, res) => {
    res.send('User has signed in');
};
userCtrl.logOut = (req, res) => {
    res.send('Logged out');
}

module.exports = userCtrl;