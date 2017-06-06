const db = require('mongoskin').db('mongodb://localhost:27017/forum').collection('posts');
const moment = require('moment');


const helper = require('mongoskin').helper;
// const findAll = (callback) => {
//     db.collection('posts').find().toArray( (err, result) => {
//         callback(err, result);        
//     });
// };
const findAll = (callback) => {
    db.find().toArray(callback);
};

const findOne = (postId, callback) => { 
    db.findOne({ _id: helper.toObjectID(postId)}, callback);
}

const fillData = (callback) => {
    db.insert([
    {
        user: "Yosi",
        title: "This is a new post",
        text: "some rendom text for the post , and some more text ti fill the paragraf",
        createdAt: new Date(),
        editedAt: ''
    },   
    ], callback);
}


module.exports = {
    findAll,
    findOne,
    fillData
};