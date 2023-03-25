let Admin = require('../config').admin;
let dbURI = require('../config').dbURI;
const db = require('../db/database').connection;
let User = require('../models/user')
let docModel = require('../models/documents').Document;
let multer = require('multer');
let fs = require('fs');
let path = require('path');
let mime = require('mime');
let ObjectID = require('mongoose').Types.ObjectId;
let storageConfig = require('../config').storageConfig;




/**
 *  UPLOADER MIDDLWARE  
 */
const uploadFile = require("../middlewares/upload");

/**
 * Upload a document
 */
let upload = async(req, res) => {
    let document = new docModel({
        name: req.file.originalname,
        path: req.file.path,
        type: req.file.mimetype,
        size: req.file.size,
        user: new ObjectID(SelectedUser._id),
        date: new Date(),
        email: userInfo.email,
        uid: userInfo.uid
    });
    await document.save()






    const get = async(req, next, res) => { 


        let documents = await db.collection('documents').find({}).toArray()
            .then(function(documents) {
                /**
                 * Return the documents
                 */
                return documents;
                next();

            }).catch(function(error) {
                console.log("Error getting documents: ", error);

            });

        if (documents) {
            res.locals.documents = documents;
            next();
        }

    }
}

const Document = require('../models/documents').Document;





const getUnapproved = async(req, next, res) => {
    let documents = await db.collection('documents').where('approved', '==', false).get()
        .then(function(querySnapshot) {
            return querySnapshot.docs;
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });

    if (documents) {
        res.status(200);

        res.locals.documents = documents;
        next();
    } else {
        res.status(500);
        res.send('Failed');
    }
}


const getByUser = async(req, res, next) => {
    console.log(req.session.user);
    let user = req.session.user;

    let uid = req.params.uid || req.body.uid || user.uid
    console.log('UID: ' + uid);
    let documents = await docModel.find({ email: 'mmarzou0@gmail.com' }).toArray()
        .then(function(documents) {
            console.log(documents);
            return documents;
        })

    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });


    if (documents) {
        res.locals.documents = documents;
        next();

    }

}

const add = async(req, next, res) => {
    /**
     * GET THE FILE FROM THE REQUEST
     */
    let document = req.body;
    /**
         *  CREATE DOCUMENT OBJECT
     
            */
    let newDocument = new docModel({

        name: document.name,
        path: document.path,
        type: document.type,
        size: document.size,
        user: new ObjectID(req.session.user._id),
        date: new Date(),
        email: document.email,
        uid: document.uid
    });


    newDocument.save()
        .then(function(docRef) {

                res.status(200);
                res.send('Document added');
                next();
            }
            .catch(function(error) {
                    res.status(500);
                    res.send('Failed');
                    next();
                }



            )
        )
    module.exports = {
        get,
        getUnapproved,
        getByUser,
        add,
        upload,
        uploadFile
    }
}