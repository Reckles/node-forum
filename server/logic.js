const repositoryUsers = require('./repositorys/users');
const repositoryPosts = require('./repositorys/posts');
const router = require('./router');


const getHome = () => {
    return repositoryPosts.findAll()
}

const getPost = (postId) => { 
    return repositoryPosts.findOne(postId)   
}

const postComment = (comment) => {
    comment.createdAt = new Date();
    return repositoryPosts.update(comment)
}


const getFill = (callback)=>{
    repositoryPosts.fillData(callback)
}

module.exports = {
    getHome,
    getPost,
    postComment,
    getFill
};