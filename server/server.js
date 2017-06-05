const repositoryUsers = require('./repositorys/users');
const repositoryPosts = require('./repositorys/posts');
const router = require('./router');


const getHome = (callback)=>{
    repositoryPosts.findAll(callback)
}

const getFill = (callback)=>{
    repositoryPosts.fillData(callback)
}

module.exports = {
    getHome,
    getFill
};