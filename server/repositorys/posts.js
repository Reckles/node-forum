const db = require('mongoskin').db('mongodb://localhost:27017/forum');
const moment = require('moment');

const collection = 'posts';

// const findAll = (callback) => {
//     db.collection('posts').find().toArray( (err, result) => {
//         callback(err, result);        
//     });
// };
const findAll = (callback) => {
    db.collection(collection).find().toArray(callback);
};

const findOne = ({_id},callback) => {
    db.collection(collection).findOne({_id}, callback);
}

const fillData = (callback) => {
    db.collection(collection).insert([
    {
        user: "Yosi",
        title: "This is a new post",
        text: "some rendom text for the post , and some more text ti fill the paragraf",
        createdAt: new Date()
    },
     {
        user: "Denis",
        title: "Idatabase rockband. I have nam",
        text: "some rendom text for the post , and some more text ti fill the paragraf",
        createdAt: new Date()
    },
     {
        user: "Yaniv",
        title: "Hand some more",
        text: "some rendom text for the post , and some more text ti fill the paragraf",
        createdAt: new Date()
    },
     {
        user: "David",
        title: "Rendom text for the post",
        text: "some rendom text for the post , and some more text ti fill the paragraf",
        createdAt: new Date()
    }
    ], callback);
}


module.exports = {
    findAll,
    findOne,
    fillData
};