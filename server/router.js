const express = require('express');
const moment = require('moment');
const db = require('mongoskin').db('mongodb://localhost:27017/forum');


const repositoryPosts = require('./repositorys/posts');
const server = require('./server');
const app = express();


app.use(express.static('public'))
app.set('view engine', 'ejs');


app.get('/', (req, res)=>{
    server.getHome((err,posts)=>{
        if(err) {
            return console.log('Error', err);
        } else {
            res.render('pages/index', {posts});
        }
    });
});

app.get('/post', (req, res)=>{
    server.getPost(req.query.id, (err, result)=>{
        if(err) {
            return console.log("cant find post");
        } else {
            var post = result;            
            res.render('pages/post', {post})
        }
    });
});


app.get('/fill', (req, res)=>{

    server.getFill((err, result)=>{
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
