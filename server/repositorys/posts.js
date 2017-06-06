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
    })

}

const fillData = (callback) => {
    db.insert([
    {
        userName: "Yosi",
        title: "This is a new post",
        text: "some rendom text for the post , and some more text ti fill the paragraf",
        createdAt: new Date(),
        editedAt: '',
        comments:[ 
            {
             commenterId: '1122255454488855sddad4as',
             userName: 'Tolik',
             text: 'I commentin on Yosis post',
             createdAt: new Date(),
             editedAt: ''
           },
            {
             commenterId: '22sd122255454488855sddad4as',
             userName: 'Amir',
             text: 'Not a commentin on Yosis post',
             createdAt: new Date(),
             editedAt: ''
           },
            {
             commenterId: '11222df5sddad4as',
             userName: 'Eli',
             text: 'I commentin on Yosis post',
             createdAt: new Date(),
             editedAt: ''
           }
        ]
    }   
    ], callback);
}


module.exports = {
    findAll,
    findOne,
    fillData
};