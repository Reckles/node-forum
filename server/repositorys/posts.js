const db = require('mongoskin').db('mongodb://localhost:27017/forum').collection('posts');
const moment = require('moment');

const helper = require('mongoskin').helper;


const findAll = () => {
    return new Promise((resolve, reject) => {
      db.find().toArray((err, result) => {
        if (err) {
            reject(err)
        } else {
            resolve(result)
        }
      });
    });
};

const findOne = (postId) => { 
    return new Promise((resolve, reject) => {
        db.findOne({ _id: helper.toObjectID(postId)}, (err, result) => {
        if (err) {
            reject(err)
        } else {
            resolve(result)
        }
      });
    });

}

const update = (comment) => {
    return new Promise((resolve, reject) => {
        db.update({_id: helper.toObjectID(comment.id)}, {
            $push: {comments: comment}
        }, (err, result) => {
            if(err) {
                reject(err)
            } else {
                resolve(result)
            }
        });
    });
}

const insert = (data) => {
    return new Promise((resolve, reject) => {
        db.insert({
            userName: data.userName,
            title: data.title,
            text: data.text,
            createdAt: data.createdAt
        },(err, result) => {
            if(err) {
                reject(err)
            } else {
                resolve(result)
            }
        });
    });
}


module.exports = {
    findAll,
    findOne,
    update,
    insert
};