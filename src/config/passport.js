const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const user = require('../models/users');

passport.use(new localStrategy({
    usernameField:'email',
    passwordField:'password'
}, async (email,password, done) => { 
    
    // Verify existence of user's email
    const currentUser = await user.findOne({email});
    if (!currentUser){
        return done(null, false, {message: 'No user found with that email.'});
    } else {
        // Verify user's password
        const match = await currentUser.matchPassword(password)
        if (match) {
            return done(null,currentUser)
        } else{
            return done(null,false,{message: 'Incorrect password.'})
        }
    }
}));

passport.serializeUser((currentUser,done) => {
    done(null,currentUser.id);
});

passport.deserializeUser((id,done) => {
    user.findById(id, (err,currentUser) => {
        done(err,currentUser);
    })
})