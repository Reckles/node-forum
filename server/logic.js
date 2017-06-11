const repositoryUsers = require('./repositorys/users');
const repositoryPosts = require('./repositorys/posts');
const expressValidator = require('express-validator');
const bcrypt = require('bcrypt');

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

const postRegister = (req) => {
    const user = {};

    return new Promise((resolve, reject) => {
      req.checkBody('userName', 'Username field cannot be empty.').notEmpty();
      req.checkBody('userName', 'Username must be between 4-15 characters long.').len(4, 15);
      req.checkBody('userName', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');
      req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
      req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
      req.checkBody('password', 'Password must be between 8-100 characters long.').len(5, 100);
      req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{5,}$/, "i");
      req.checkBody('passwordMatch', 'Password must be between 8-100 characters long.').len(5, 100);
      req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);   
     

      const errors = req.validationErrors();

      if(errors){
        reject(errors)        
     } else {
        user.userName = req.body.userName;
        user.email = req.body.email;
        user.createdAt = new Date();
        user.password = encryptPassword(req.body.password)
        .then(result => {
            user.password = result
            resolve(repositoryUsers.register(user)) 
        });           
     }
 })
   
    
}



module.exports = {
    getHome,
    getPost,
    postComment,
    postNewPost,
    postRegister,
    getFill,
    encryptPassword,
};