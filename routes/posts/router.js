const router = require('express').Router();

const logic = require('../../server/logic');

function ensureAuthenticated (req, res, next){
    if(req.isAuthenticated()){
         next()        
    } else{
        res.redirect('/login');
    }
}
    //GET 
router.get('/:id', ensureAuthenticated, (req, res) => {   
    if(req.params.id){
        logic.getPost(req.params.id)
        .then(post =>{
            res.render('pages/post', {post})
        })
        .catch(err => {
            res.render('pages/error')
    })   
    } else{
        res.render('pages/error')
     } 
})

router.get('/:id/edit', ensureAuthenticated, (req, res) => {
    var postId = req.params.id;
    logic.getPost(postId)
    .then(post=>{
        res.json(post).send()
    })
    .catch(err=>{
        res.status(400).send()
    })
});


router.get('/comment/:id/edit', ensureAuthenticated, (req, res) => {
    var commentId = req.params.id;
    logic.getComment(commentId)
    .then(comment=>{
        res.json(comment).send()
    })
    .catch(err=>{
        res.status(400).send()
    })
});

        //POST
router.post('/', (req,res) => {
    logic.postNewPost(req.body.data, req.user)
    .then(result => {
         res.send(result);    
    }).catch(err => {
         res.status(404).send()
    })
})

router.post('/:id/edit', (req, res) => {
    logic.postEditPost(req.body.data, req.user._id)
    .then(result => {
         res.status(200).send();  
    })
    .catch(err => {
        res.status(404).send()
    })
});

router.post('/:id/delete', (req, res) => {
    logic.postDeletePost(req.params.id, req.user&&req.user._id)
    .then(posts => { 
        res.status(200).send()
    })
    .catch(err => {
        res.status(404).send()
    })
});

router.post('/:id/comment', (req, res) => {
    logic.postComment(req.body.data, req.user)   
    .then(result =>{
        res.send(result);
    })  
    .catch(err => {
        res.status(404).send()
    })        
});

router.post(`/comment/:id/edit`, (req, res) => {
    logic.postEditComment(req.body.data, req.user._id)   
    .then(result =>{
        res.status(200).send();
    })  
    .catch(err => {
        res.status(404).send()
    })        
});

router.post(`/comment/:id/delete`, (req, res) => {
    logic.postDeleteComment(req.params.id, req.user._id)
    .then(result => {
        res.status(200).send();
    })
    .catch(err => {
        res.status(404).send();
    })
});




module.exports = router;