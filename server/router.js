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

const repositoryPosts = require('./repositorys/posts');
const repositoryUser = require('./repositorys/users');
const logic = require('./logic');

const app = express();


passport.serializeUser(function(user, done) {
    done(null, user)
});

passport.deserializeUser((user, done) => {
           done(null, user)    
});

app.use(express.static(path.join(__dirname, '..', 'public')));



app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('secret'));

//User registration validator
app.use(expressValidator());

app.use(session({
    secret:'secret',
    resave: false, saveUninitialized: false
}));
app.use(passport.initialize());

//Passport
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
             return done(null, user);
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

//Flash messages
app.use(flash());

//Global Vars
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


//GET requests
app.get('/', ensureAuthenticated, (req, res)=>{
    logic.getHome()
    .then(posts => {
        res.render('pages/index', {posts, user: res.locals.user});
    })
    .catch(err=>{
        res.render('pages/error', {errors: err})
    })
});

app.get('/post', ensureAuthenticated, (req, res) => {
    var postId = req.query.id;
    if(postId){
        logic.getPost(req.query.id)
        .then(post =>{
        res.render('pages/post', {post})
        })
        .catch(err => {
        res.render('pages/error', {errors: err})
    })   
    } else{
        res.render('pages/error', {errors: null})
     } 
});

app.get('/about', ( req, res )=>{
     res.render('./pages/about');
});

app.get('/register', (req, res)=>{
    res.render('pages/register', {title: 'Register', errors: null, user: res.locals.user})
});

app.get('/login', (req, res) => {
    res.render('pages/login', {title: 'Login', user: res.locals.user})
});

app.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg, "you are logged out');
    res.redirect('/login');
})

//POST requests
app.post('/newPost', (req,res) => {
    logic.postNewPost(req.body.data)
    .then(resulte => {
         res.redirect('/');    
    }).catch(err => {
      res.render('pages/error', {errors: err})
    })
})

app.post('/comment', (req, res) => {
    logic.postComment(req.body.data)   
    .then(result =>{
        if(result.result.n>1){
            res.send(result.result.opt[0])
        }
        else {
            res.status(500).send();
        }
        res.send('pages/post')
    })  
    .catch(err => {
        res.render('pages/error', {errors: err})
    })        
});

app.post('/register', (req, res)=>{
    logic.postRegister(req)
    .then(result => {
        res.render('pages/login', {title: 'Registretion complite please login'})
    })
    .catch(err => {
        res.render('pages/register', {title: 'Sorry wrong input try again', errors: err, user: res.locals.user})
    })
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/about',
    failureFlash: true
    }),
    (req, res)=>{
      res.redirect('/');
});


app.listen(8000, () =>{
    console.log(`Started at port 8000`);
});
