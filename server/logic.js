const repositoryUsers = require('./repositorys/users');
const repositoryPosts = require('./repositorys/posts');
const router = require('./router');

//GET requests
const getHome = () => {
    return repositoryPosts.findAll()
}

const getPost = (postId) => { 
    return repositoryPosts.findOne(postId)   
}
    //Fill data base inner use only
const getFill = (callback)=>{
    repositoryPosts.fillData(callback)
}

//POST requests 
const postNewPost = (data) => {
    data.createdAt = new Date();
    return repositoryPosts.insert(data);
}

const postComment = (comment) => {
    comment.createdAt = new Date();
    return repositoryPosts.update(comment)
}

const postRegister = (user) => {
    user.createdAt = new Date();
    return repositoryUsers.register(user);
}



module.exports = {
    getHome,
    getPost,
    postComment,
    postNewPost,
    postRegister,
    getFill
};