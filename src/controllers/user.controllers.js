const userCtrl = {};
const user = require('../models/users');
const passport = require('passport');
const nodemailer = require('nodemailer');
const { EMAIL, EMAIL_PASSWORD } = process.env;

userCtrl.renderSignUpForm = (req, res) => {
    res.render('./users/signUp');
};
userCtrl.signUp = async (req, res) => {
    const errors = [];
    const { name, email, password, confirmPassword } = req.body;
    if (password != confirmPassword) {
        errors.push({ text: 'Password do not match.' });

    }
    if (password.length < 5) {
        errors.push({ text: 'Password should have atleast 6 characters.' });
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
                    return res.redirect('/forgot');
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
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    res.send('Email sent');
                }
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
};

module.exports = userCtrl;