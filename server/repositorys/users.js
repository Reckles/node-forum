const db = require('mongoskin').db('mongodb://localhost:27017/forum').collection('users');
const moment = require('moment');

const helper = require('mongoskin').helper;


const register = (user) => {
    return new Promise((resolve, reject) => {
        db.insert({
            userName: user.userName,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt
        }, (err, result) => {
            if(err) {
                reject(err)
            } else {
                resolve(result)
            }
        });
    });
}

module.exports = {
    register
}