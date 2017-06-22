
const router = require('express').Router();
const expressValidator = require('express-validator');

const repositoryPosts = require('../../server/repositorys/posts');
const repositoryUser = require('../../server/repositorys/users');
const logic = require('../../server/logic');

function ensureAuthenticated (req, res, next){
    if(req.isAuthenticated()){
         next()        
    } else{
        res.redirect('/login');
    }
}
        //GET
router.get('/', ensureAuthenticated, (req, res)=>{
        logic.getHome()
        .then(posts => {   
            res.render('pages/index', {posts, user: res.locals.user});
        })
        .catch(err=>{
            res.render('pages/error', {errors: {err}})
        })
})

router.get('/search', ensureAuthenticated, (req, res)=>{
    // const regex = new RegExp(req.query.search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi');
    const regex = req.query.search
    const from = req.query.from
    const until = req.query.until

    logic.getSearch(regex, from, until)
    .then(posts=>{
         res.render('pages/index', {posts, user: res.locals.user})
    })
    .catch(err=>{
        res.render('pages/error', {errors: {err}})
    })
})

router.get('/about', ( req, res )=>{
     res.render('./pages/about');
});

router.get('/register', (req, res)=>{
    res.render('pages/register', {title: 'Register', error: null, user: res.locals.user})
});

router.get('/login', (req, res) => {
    res.render('pages/login', {title: 'Login', user: res.locals.user, errors: null, user: res.locals.user})
});

router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg, "you are logged out');
    res.redirect('/login');
})

        //POST

router.post('/register', (req, res)=>{
    req.checkBody('userName', 'Username field cannot be empty.').notEmpty();
        req.checkBody('userName', 'Username must be between 4-15 characters long.').len(4, 15);
        req.checkBody('userName', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');
        req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
        req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
        req.checkBody('password', 'Password must be between 8-100 characters long.').len(5, 100);
        req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{5,}$/, "i");
        req.checkBody('passwordMatch', 'Password must be between 8-100 characters long.').len(5, 100);
        req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);   

        let errors = req.validationErrors();
        
        if(!errors){
            logic.postRegister(req.body)
            .then(result => {
                res.render('pages/login', {title: 'Registretion complite please login'})
            })
            .catch(err => {
                errors = [{msg: err}]
                res.render('pages/register', {title: 'Sorry wrong input try again', error: errors, user: res.locals.user})
            })    
        } else {
            res.render('pages/register', {title: 'Sorry wrong input try again', error: errors, user: res.locals.user})    
        }
});


module.exports = router;