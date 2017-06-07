const express = require('express');
const moment = require('moment');
const db = require('mongoskin').db('mongodb://localhost:27017/forum');

const repositoryPosts = require('./repositorys/posts');
const logic = require('./logic');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.use(express.static('public'))
app.set('view engine', 'ejs');
// app.set('view', path.join(__dirname, 'views'));
// app.engine('ejs', engine);

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



app.get('/', (req, res)=>{
    logic.getHome()
    .then(posts => {
        res.render('pages/index', {posts});
    })
    .catch(err=>{
        res.render('pages/error')
    })
});

app.get('/post', (req, res) => {
    logic.getPost(req.query.id)    
    .then(post =>{
        res.render('pages/post', {post})
    })
    .catch(err => {
        res.render('pages/error')
    })         
});


app.post('/comment', (req, res) => {
    logic.postComment(req.body.data)   
    .then(result =>{
        if(result.result.n>1){
            res.send(result.result.opt[0])
        }
        else {
            res.status(500).send();
        }
        res.send('pages/post', {post})
    })  
    .catch(err => {
        res.render('pages/error')
    })        
});


app.get('/fill', (req, res)=>{
    logic.getFill((err, result)=>{
        if(err) {
            return console.log('Cant fill DB : ', err );
        } else {
            res.send('Added to DB');
        }
    });
});

app.get('/about', ( req, res )=>{
     res.render('./pages/about');
});

app.listen(8000, () =>{
    console.log(`Started at port 8000`);
});
