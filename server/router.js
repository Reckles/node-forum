const express = require('express');
const path = require('path');
const cookieParser =require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
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

app.use(express.static(path.join(__dirname, '..', 'public')));

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressValidator());
app.use(passport.initialize());

//Passport
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user)
});

passport.deserializeUser((user, done) => {
    repositoryUsers.findById(id, (err, user) => {
        done(err, user)
    });
});

passport.use(new LocalStrategy(
    function(email, password, done){
        repositoryUser.findOne(email)
        .then(user => {     
            if(!user){
                return done(null, false, {message: 'Unkown user'});
            }
            repositoryUser.comparePassword(password, user.password, (err, isMatch)=>{
                if(err){
                    throw err;
                }
                if(isMatch){
                    return done(null, user);
                } else{
                    return done(null, false, {message: 'invalid password'});
                }
            })
        })
}));

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Flash messages
app.use(flash());

app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.localserror_msg = (req.flash('error_msg'));
    res.locals = req.flash('error');
    next();
});


//GET requests
app.get('/', (req, res)=>{
    logic.getHome()
    .then(posts => {
        res.render('pages/index', {posts});
    })
    .catch(err=>{
        res.render('pages/error', {errors: err})
    })
});

app.get('/post', (req, res) => {
    logic.getPost(req.query.id)    
    .then(post =>{
        res.render('pages/post', {post})
    })
    .catch(err => {
        res.render('pages/error', {errors: err})
    })         
});

app.get('/about', ( req, res )=>{
     res.render('./pages/about');
});

app.get('/register', (req, res)=>{
    res.render('pages/register', {title: 'Register', errors: null})
});

app.get('/login', (req, res) => {
    res.render('pages/login', {title: 'Login'})
});

app.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg, "you are logged out');
    resredirect('/login');
})
        //Fill data base inner use only
app.get('/fill', (req, res)=>{
    logic.getFill((err, result)=>{
        if(err) {
            return console.log('Cant fill DB : ', err );
        } else {
            res.send('Added to DB');
        }
    });
});

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
        res.render('pages/register', {title: 'Sorry wrong input try again', errors: err})
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
