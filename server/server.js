const repositoryUsers = require('./repositorys/users');
const repositoryPosts = require('./repositorys/posts');
const router = require('./router');


const getHome = (callback)=>{
    repositoryPosts.findAll(callback)
}

const getPost = (postId,callback)=>{
    repositoryPosts.findOne(postId, callback)
    //To implement comments 
    // repositoryPosts.find()
}

const getFill = (callback)=>{
    repositoryPosts.fillData(callback)
}

module.exports = {
    getHome,
    getPost,
    getFill
};