const express = require('express');
const path = require('path');
const ejs = require('ejs');
const morgan = require('morgan');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//Initialization

const app = express();
require('./config/passport');

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret:'anything',
    resave:true,
    saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global variables

app.use((req,res,next) =>{
    res.locals.successMsg = req.flash('success');
    res.locals.errorMsg = req.flash('error');
    res.locals.warningMsg = req.flash('warning');
    res.locals.currentUser = req.currentUser || null; // Importante, si el user no existe devuelve null..
    res.locals.userIsLogged = req.isAuthenticated();
    next();
}
);

//Middlewares
app.use(express.urlencoded({ extended: false })); // Convierte datos a JSON supuestamente
app.use(morgan('dev'));
app.use(methodOverride('_method'));

// Routes
app.use(require('./routes/index.routes'));
app.use(require('./routes/board.routes'));
app.use(require('./routes/user.routes'));


//Static files
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;