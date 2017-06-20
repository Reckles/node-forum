/*
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

app.use(flash());

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
                if(isMatch){
                    return done(null, user);
                } else{
                    return done(null, false, {message: 'Wrong username or passport'})

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

        //GET requests     
app.get('/', ensureAuthenticated, (req, res)=>{

    if(req.query.search) {
        const regex = new RegExp(req.query.search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi');
        getIndex(regex);
    } else{
        getIndex();
    }

    function getIndex(query){
        logic.getHome(query)
        .then(posts => {   
            res.render('pages/index', {posts, user: res.locals.user});
        })
        .catch(err=>{
            res.render('pages/error', {errors: {err}})
    })}
});

app.get('/post/:id', ensureAuthenticated, (req, res) => {   
    if(req.params.id){
        logic.getPost(req.params.id)
        .then(post =>{
            res.render('pages/post', {post, moment})
        })
        .catch(err => {
            res.render('pages/error', {errors: err})
    })   
    } else{
        res.render('pages/error', {errors: null})
     } 
});

app.get('/post/:id/edit', ensureAuthenticated, (req, res) => {
    var postId = req.params.id;
    logic.getPost(postId)
    .then(post=>{
        res.json(post).send()
    })
    .catch(err=>{
        res.status(400).send()
    })
});
app.get('/post/comment/:id/edit', ensureAuthenticated, (req, res) => {
    var commentId = req.params.id;
    logic.getComment(commentId)
    .then(comment=>{
        res.json(comment).send()
    })
    .catch(err=>{
        res.status(400).send()
    })
});

app.get('/about', ( req, res )=>{
     res.render('./pages/about');
});

app.get('/register', (req, res)=>{
    res.render('pages/register', {title: 'Register', errors: null, user: res.locals.user})
});

app.get('/login', (req, res) => {
    res.render('pages/login', {title: 'Login', user: res.locals.user, errors: null, user: res.locals.user})
});

app.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg, "you are logged out');
    res.redirect('/login');
})

        //POST requests
app.post('/post', (req,res) => {
    logic.postNewPost(req.body.data, req.user)
    .then(resulte => {
         res.status(200).send();    
    }).catch(err => {
         res.status(404).send()
    })
})

app.post('/post/:id/comment', (req, res) => {
    logic.postComment(req.body.data, req.user)   
    .then(result =>{
        res.status(200).send();
    })  
    .catch(err => {
        res.status(404).send()
    })        
});

app.post(`/post/comment/:id/edit`, (req, res) => {
    logic.postEditComment(req.body.data, req.user._id)   
    .then(result =>{
        res.status(200).send();
    })  
    .catch(err => {
        res.status(404).send()
    })        
});

app.post('/post/:id', (req, res) => {
    logic.postEditPost(req.body.data, req.user._id)
    .then(result => {
         res.status(200).send();  
    })
    .catch(err => {
        res.status(404).send()
    })
});

app.post('/post/:id/delete', (req, res) => {
    logic.postDeletePost(req.params.id, req.user&&req.user._id)
    .then(result => {
        res.status(200).send();  
    })
    .catch(err => {
        res.status(404).send()
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
    failureRedirect: '/login?error',
    failureFlash: true
    }),
    (req, res)=>{
      res.redirect('/');
});


app.listen(8000, () =>{
    console.log(`Started at port 8000`);
});
*/