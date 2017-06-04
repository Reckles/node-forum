const express = require('express');
const moment = require('moment');

const app = express();
app.use(express.static('public'))
app.set('view engine', 'ejs');

app.get('/', (req, res)=>{

var posts = [
    {
        user: "Yosi",
        title: "This is a new post",
        text: "some rendom text for the post , and some more text ti fill the paragraf",
        createdAt: new Date()
    },
     {
        user: "Denis",
        title: "This is a new post",
        text: "some rendom text for the post , and some more text ti fill the paragraf",
        createdAt: new Date()
    },
     {
        user: "Yaniv",
        title: "This is a new post",
        text: "some rendom text for the post , and some more text ti fill the paragraf",
        createdAt: new Date()
    },
     {
        user: "David",
        title: "This is a new post",
        text: "some rendom text for the post , and some more text ti fill the paragraf",
        createdAt: new Date()
    }
];
    res.render('pages/index', {posts});

});

app.get('/about', (req, res)=>{
    res.render('pages/about');
});

app.listen(8000, () =>{
    console.log(`Started at port 8000`);
});
