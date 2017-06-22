
const uuidv1 = require('uuid/v1');
const moment = require('moment');
const bcrypt = require('bcrypt');

const repositoryUsers = require('./repositorys/users');
const repositoryPosts = require('./repositorys/posts');

const helper = require('mongoskin').helper;

const saltRounds = 10;
const router = require('./router');

const encryptPassword = (password) => {
    return new Promise((resolve, reject)=>{
        bcrypt.hash(password, saltRounds, (err, done)=>{
            if(err) {
                reject(err)
            } else {
                resolve(done)
            }
        });
    });
}

//GET requests
const getHome = () => {
    return repositoryPosts.findAll()
}

const getSearch = (query, from, until) => {
    from = moment.utc(from, "MM.DD.YYYY").toDate();
    until = moment.utc(until, "MM.DD.YYYY").toDate();

    if (!moment(from).isValid()){
        from = null
    }
    if (!moment(until).isValid()){
        until = null
    }
    
    return  repositoryPosts.search( from, until, query);
}

const getPost = (postId) => { 
    return repositoryPosts.findOne(postId)   
}

const getComment = (commentId) => { 
    return repositoryPosts.findOneComment(commentId)

}

const postNewPost = (data, user) => {
    data.userName = user.userName;
    data.createdAt = new Date();
    data.updatedAt = new Date();

    return repositoryPosts.insertPost(data, user._id)
    .then((result)=>{
        return result.result.n === 1 ? result.ops[0] : null
    })
}

const postComment = (comment, user) => {
    postId = comment.id
    comment.id = uuidv1();
    comment.creatorId = user._id;
    comment.userName = user.userName;
    comment.createdAt = new Date();
    comment.updatedAt = new Date();

    return repositoryPosts.insertComment(comment, postId)
    .then(result=> {return comment } )  
}

const postEditComment = (data, userId) => {
    data.updatedAt = new Date();
    return repositoryPosts.editComment(data, userId)
}

const postEditPost = (data, userId) => {
    data.updatedAt = new Date();
    return repositoryPosts.editPost(data, userId);
}

const postDeletePost = (postId, userId) => {
    return repositoryPosts.deletePost(postId, userId)
    .then((posts)=>{
        return getHome()
    })
}
// const postDeletePost = (postId, userId) => {
//     return repositoryPosts.deletePost(postId, userId)
// }

const postDeleteComment = (commentId, userId) => {
    return repositoryPosts.deleteComment(commentId, userId)
}

const postRegister = (user) => {
   return repositoryUsers.findOne(user.email)   
    .then(result=>{
        if(result){
            return Promise.reject("This email already used") 
        }  else{
            user.createdAt = new Date()
            encryptPassword(user.password)                    
            .then( encryptedPassword => {
                user.password = encryptedPassword
                return repositoryUsers.register(user)  
            })            
        }
    })    
}



module.exports = {
    getHome,
    getSearch,
    getPost,
    getComment,
    postComment,
    postEditComment,
    postDeleteComment,
    postNewPost,
    postEditPost,
    postDeletePost,
    postRegister,
    encryptPassword
}