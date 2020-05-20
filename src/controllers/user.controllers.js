const userCtrl = {};
const user = require('../models/users');

userCtrl.renderSignUpForm = (req, res) => {
    res.render('./users/signUp');
};
userCtrl.signUp = async (req, res) => {
    const errors = [];
    //res.locals.errors = errors;
    const {name, email, password, confirmPassword } = req.body;
    if (password != confirmPassword) {
        errors.push({text:'Password do not match.'}); 
       
    }
    if (password.length < 5) {
        errors.push({text:'Password should have atleast 6 characters.'});
    }
    if (errors.length>0) {
        res.render('./users/signUp', {errors})
       // res.redirect('/auth/signUp')
    } else {
        const userEmail = await user.findOne({email:email})
        if (userEmail) {
            req.flash('error', 'This email is already in use.');
            res.redirect('/auth/signup');
        } else {
            const newUser = new user({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            console.log('New user is');
            console.log(newUser);
            req.flash('success', 'Your account was registered!');
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