const db = require('mongoskin').db('mongodb://localhost:27017/forum').collection('users');
const moment = require('moment');
const bcrypt = require('bcrypt');

const helper = require('mongoskin').helper;


const findById = (id) => {
    return new Promise((resolve, reject) => {
        db.findOne({_id: id}, (err, result) => {
        if (err) {
            reject(err)
        } else {
            resolve(result)
        }
      });
    });
}

const findOne = (email) => { 
    return new Promise((resolve, reject) => {
        db.findOne({'email': email}, (err, result) => {
        if (err) {
            reject(err)
        } else {
            resolve(result)
        }
      });
    });
}


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

const comparePassword = (canddatePassword, hash)=>{
    return new Promise((resolve, reject)=>{
        bcrypt.compare(canddatePassword, hash, (err, isMatch)=>{
        if(err){
            reject(err);
        } else{
            resolve(isMatch);
        }       
      })
    })
}



module.exports = {
    register,
    findOne,
    findById,
    comparePassword
}