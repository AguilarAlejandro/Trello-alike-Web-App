const { Router } = require('express');
const router = Router();
const {
    renderSignUpForm, 
    renderSignInForm, 
    logIn, 
    signUp, 
    renderResetForm,
    resetPassword,
    processPasswordReset,
    setNewPassword,
    logOut } = require('../controllers/user.controllers');

const {isNotAuthenticated} = require('../config/auth');

router.get('/auth/signup', isNotAuthenticated, renderSignUpForm);

router.post('/auth/signup', signUp);

router.get('/auth/login', renderSignInForm);

router.post('/auth/login', logIn);

router.get('/auth/logout', logOut);

router.get('/auth/forgot', renderResetForm);

router.post('/auth/forgot', resetPassword);

router.get('/auth/reset/:token', processPasswordReset);

router.post('/auth/reset/:token', setNewPassword);

module.exports = router;