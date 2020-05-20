const { Router } = require('express');
const router = Router();
const {
    renderSignUpForm, 
    renderSignInForm, 
    logIn, 
    signUp, 
    logOut } = require('../controllers/user.controllers');

router.get('/auth/signup', renderSignUpForm);

router.post('/auth/signup', signUp);

router.get('/auth/login', renderSignInForm);

router.post('/auth/login', logIn);

router.get('/auth/logout', logOut);

module.exports = router;