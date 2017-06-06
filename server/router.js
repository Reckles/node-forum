const express = require('express');
const moment = require('moment');
const db = require('mongoskin').db('mongodb://localhost:27017/forum');


const repositoryPosts = require('./repositorys/posts');
const logic = require('./logic');
const app = express();


app.use(express.static('public'))
app.set('view engine', 'ejs');


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
     res.render('pages/about');
  
});

app.listen(8000, () =>{
    console.log(`Started at port 8000`);
});
