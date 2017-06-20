const express = require('express');
const expressValidator = require('express-validator');
const path = require('path');
const cookieParser =require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const moment = require('moment');
const db = require('mongoskin').db('mongodb://localhost:27017/forum');

const repositoryUser = require('./server/repositorys/users');
const logic = require('./server/logic');

const app = express();


passport.serializeUser(function(user, done) {
    done(null, user)
});

passport.deserializeUser((user, done) => {
    done(null, user)    
});

app.use(express.static(path.join(__dirname, 'public')));



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('secret'));

app.use(expressValidator());

app.use(session({
    secret:'secret',
    resave: false, saveUninitialized: false
}));

app.use(flash());

app.use(passport.initialize());

app.use(passport.session());

passport.use( new LocalStrategy( 
    function(username, password, done){
        repositoryUser.findOne(username)
        .then(user => {     
            if(!user){
                return done(null, false, {message: 'Unkown user'});            
            }
            
            repositoryUser.comparePassword(password, user.password)
            .then(isMatch =>{
                if(isMatch){
                    return done(null, user);
                } else{
                    return done(null, false, {message: 'Wrong username or password !'})

                }           
            })
        })
}));

function ensureAuthenticated (req, res, next){
    if(req.isAuthenticated()){
         next()        
    } else{
        res.redirect('/login');
    }
}

app.use(function(req, res, next){
    try{
        if(req.session.passport.user){
        res.locals.user = req.session.passport.user
        } 
    } catch(err){
        res.locals.user = null;
    }
 
    next();
});

app.use('/post', require('./routes/posts/router'))

app.use('/', require('./routes/users/router'))

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?error',
    failureFlash: true
    }),
    (req, res)=>{
      res.redirect('/');
});


app.listen(8000, () =>{
    console.log(`Started at app port 8000`);
});
