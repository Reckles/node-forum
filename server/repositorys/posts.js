const db = require('mongoskin').db('mongodb://localhost:27017/forum').collection('posts');
const moment = require('moment');

const helper = require('mongoskin').helper;


const findAll = () => {
    return new Promise((resolve, reject) => {
      db.find().sort({
          updatedAt: -1
      }).toArray((err, result) => {
        if (err) {
            reject(err)
        } else {
            resolve(result)
        }
      });
    });
};

const search = (from, until, query) => {
    var toFindObject = {}  

    if (query) {
        toFindObject = {
            $or: [{title: query}, {"comments.text": query}]
        }
    }

    if (from||until) {
        toFindObject.createdAt = {}
    }

    if(from) {
        toFindObject.createdAt.$gte = from
    }

    if(until) {
        toFindObject.createdAt.$lt = until
    } 

    return new Promise((resolve, reject) => {
        db.find(toFindObject).toArray((err, result)=>{
            if(err) {
                reject(err)
            } else {
                resolve(result)
            }
        })    
    });
}

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
const findOneComment = (commentId) => { 
    return new Promise((resolve, reject) => {
        db.findOne({ "comments.id": helper.toObjectID(commentId)}, (err, result) => {
        if (err) {
            reject(err)
        } else {
            var comment = result.comments.find((comment)=>{
                return comment.id === commentId
            })
            resolve(comment)
        }
      });
    });
}

const insertComment = (comment, postId) => {
    comment.creatorId = helper.toObjectID(comment.creatorId) 
    
    return new Promise((resolve, reject) => {
        db.update({_id: helper.toObjectID(postId)}, {
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

const insertPost = (data, userId) => {
    return new Promise((resolve, reject) => {
        db.insert({
            creatorId: helper.toObjectID(userId),
            userName: data.userName,
            title: data.title,
            text: data.text,
            createdAt: data.createdAt, 
            updatedAt: data.updatedAt        
        },(err, result) => {
            if(err) {
                reject(err)
            } else {
                resolve(result)
            }
        });
    });
}

const editPost = (data, userId) => {
    return new Promise((resolve, reject) => {
        db.update({
            _id: helper.toObjectID(data.id),
            creatorId: helper.toObjectID(userId)
        }, {
            $set: {
                title: data.title,
                text: data.text,
                updatedAt: data.updatedAt
            },
        }, (err, result)=>{
            if(err){
                reject(err)
            } else {
                resolve(result)
            }
        });
    });
}

const editComment = (data, userId) => {
    return new Promise((resolve, reject) => {
        db.update({
                'comments.id': data.id,
                'comments.creatorId': helper.toObjectID(userId)
            }, {
            $set: {
                "comments.$.title": data.title,
                "comments.$.text": data.text,
                "comments.$.updatedAt": data.updatedAt
            },
        }, (err, result)=>{
            if(err){
                reject(err)
            } else {
                resolve(result)
            }
        });
    });
}

const deletePost = (postId, userId) => {
    return new Promise((resolve, reject) => {
        db.deleteOne({
            _id: helper.toObjectID(postId),
            creatorId: helper.toObjectID(userId)
        },(err, result) => {
            if(err) {
                reject(err)
            } else {
                resolve(result)
            }
        });
    });
}

const deleteComment = (commentId, userId) => {
    return new Promise((resolve, reject) => {
        db.update({
                'comments.id': commentId,
                'comments.creatorId': helper.toObjectID(userId)
            }, {
            $pull: {
                    "comments": {
                        id: commentId,
                        creatorId: helper.toObjectID(userId)
                    }
                },
            },{
                multi: true
            }, (err, result)=>{
                if(err){
                    reject(err)
                } else {
                    resolve(result)
                }
            });
    });
}

module.exports = {
    findAll,
    search,
    findOne,
    findOneComment,
    insertComment,
    insertPost,
    editPost,
    editComment,
    deleteComment,
    deletePost
};