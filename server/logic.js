const repositoryUsers = require('./repositorys/users');
const repositoryPosts = require('./repositorys/posts');
const router = require('./router');


const getHome = () => {
    return repositoryPosts.findAll()
}

const getPost = (postId) => { 
    return repositoryPosts.findOne(postId)
}


const getFill = (callback)=>{
    repositoryPosts.fillData(callback)
}

module.exports = {
    getHome,
    getPost,
    getFill
};