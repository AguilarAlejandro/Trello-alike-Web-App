const userCtrl = {};
const user = require('../models/users');
const passport = require('passport');
const nodemailer = require('nodemailer');
const { EMAIL, EMAIL_PASSWORD } = process.env;
var async = require('async');
var crypto = require('crypto');

userCtrl.renderSignUpForm = (req, res) => {
    res.render('./users/signUp');
};

userCtrl.signUp = async (req, res) => {
    const errors = [];
    const { name, email, password, confirmPassword } = req.body;
    if (password != confirmPassword) {
        req.flash('error', 'Passwords do not match.');
        res.redirect('back');
    }
    if (password.length < 5) {
        req.flash('error', 'Passwords should be atleast 6 characters');
        res.redirect('back');
    }
    if (errors.length > 0) {
        res.render('./users/signUp', { errors })
    } else {
        const userEmail = await user.findOne({ email: email })
        if (userEmail) {
            req.flash('error', 'This email is already in use.');
            res.redirect('/auth/signup');
        } else {
            const newUser = new user({ name, email, password });
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

userCtrl.logIn = passport.authenticate('local', {
    failureRedirect: '/auth/login',
    successRedirect: '/board',
    failureFlash: true,
    successFlash: 'Welcome back! '
});

userCtrl.logOut = (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/');
};

userCtrl.renderResetForm = (req, res) => {
    res.render('./users/forgot', { user: req.user });
};

userCtrl.renderResetForm = (req, res) => {
    res.render('./users/forgot', { user: req.user });
};

userCtrl.resetPassword = async (req, res, next) => {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            user.findOne({ email: req.body.email }, function (err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/auth/forgot');
                }
                user.resetPasswordToken = token;
                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },

        function (token, user, done) {
            var transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                auth: {
                    type: "login", // default
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            var mailOptions = {
                from: process.env.EMAIL,
                to: user.email,
                subject: 'Reset your Padmi account password',
                text: `Greetings ${user.name}, \n\n` +
                    'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please open the following link to complete the process:\n\n' +
                    'http://' + req.headers.host + '/auth/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n\n\n\n' +
                    'Do not respond to this email address as it is not monitored'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    req.flash('success', 'An email with further information has been sent to you');
                    res.redirect('/');
                }
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/auth/forgot');
    });
};

userCtrl.processPasswordReset = async (req, res) => {
    const currentToken = req.params.token;
    user.findOne({ resetPasswordToken: req.params.token }, function (err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/auth/forgot');
        }
        var previousRoute = '/auth/reset/' + currentToken;
        console.log('previous route is ', previousRoute);
        res.render('./users/reset', {
            user: req.user, currentToken
        });
    });
};

userCtrl.setNewPassword = async (req, res) => {

    const currentUser = await user.findOne({ resetPasswordToken: req.params.token })

    if (!currentUser) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('back');
    } else {

        const { password, confirmPassword } = req.body;
        if (password != confirmPassword) {
            req.flash('error', 'Passwords do not match.');
            res.redirect('back');
        } else {

            if (password.length < 5) {
                req.flash('error', 'Password should have atleast 6 characters.');
                res.redirect('back');
            } else {

                currentUser.password = await currentUser.encryptPassword(password);
                currentUser.resetPasswordToken = undefined;
                await currentUser.save();

                var transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    auth: {
                        type: "login",
                        user: process.env.EMAIL,
                        pass: process.env.EMAIL_PASSWORD,
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                var mailOptions = {
                    to: currentUser.email,
                    from: process.env.EMAIL,
                    subject: 'Your Padmi account password has been changed',
                    text: `Hello ${currentUser.name},\n\n` +
                        `This is a confirmation that the password for your account ${currentUser.email} has just been changed.\n\n\n\n` +
                        'Do not respond to this email address as it is not monitored'
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        req.flash('success', 'Your password was reset! You can log in now.');
                        res.redirect('/')
                    }
                });
            }
        }
    }
}

module.exports = userCtrl;