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


let documentsController = (Admin) => {

    /**
     * Upload a document
     */
    let upload = async(req, res) => {
        /**
         * GET CURRENT USER
         */
        let userInfo = req.session.user

        /**
         * SEARCH FOR USER IN DATABASE
         * */






        console.log('DOCUMENTS CONTROLLER: UPLOADING DOCUMENT')
            /**
             * GET THE FILE FROM THE REQUEST
             */


        /**
         * GET THE FORM DATA FROM THE REQUEST
         */

        console.log(req.file);
        console.log(req.body);
        console.log(req.headers)
            /**
             *  CREATE DOCUMENT OBJECT 
             */
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

        /**
         * UPDATE USER DOCUMENTS ARRAY
         * */
        /**
         * UPDATE DOCUMENTS ARRAY IN USER
         * */
        let UserDocuments = SelectedUser.documents;
        //Insert the document into the user's documents array
        UserDocuments.push(req.file.filename);
        console.log('USER DOCUMENTS AFTER PUSH: ' + UserDocuments);

        //Update the user's documents array
        SelectedUser.updateOne({ documents: UserDocuments }).then((user) => {}).catch((err) => {
            console.log(err);
        });

        console.log('ADDED DOCUMENT TO DATABASE')
            /**
             * SAVE DOCUMENT TO DATABASE
             * */
        document.save().then((doc) => {
            res.status(200);
            res.send({ message: "Uploaded the file successfully: " + req.file.originalname });
        }).catch((err) => {
            console.log(err);
            req.flash('error', err);
            res.status(500);
            res.redirect('/documents');
        });
    }





    const get = async(req, res) => {

        let documents = await db.collection('documents').find({}).toArray()
            .then(function(documents) {
                return documents;

            }).catch(function(error) {
                console.log("Error getting documents: ", error);
            });

        if (documents) {
            res.status(200);
            res.send(documents);
        } else {
            res.status(500);
            res.send('Failed');
        }
    }

    const getById = async(req, res) => {
        let id = req.params.id;
        // Check if ID is valid
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(500);
            res.send('Invalid ID');
            return;
        }

        let o_id = new ObjectID(id);
        let document = await db.collection('documents').find({ _id: o_id }).toArray()
            .then(function(documents) {
                console.log(documents);
                return documents;
            }).catch(function(error) {
                console.log("Error getting documents: ", error);
            });

        if (document) {
            res.status(200);
            res.send(document);
        } else {
            res.status(500);
            res.send('Failed');
        }
    }

    const getUnapproved = async(req, res) => {
        let documents = await db.collection('documents').where('approved', '==', false).get()
            .then(function(querySnapshot) {
                return querySnapshot.docs;
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });

        if (documents) {
            res.status(200);
            res.send(documents);
        } else {
            res.status(500);
            res.send('Failed');
        }
    }

    const getByUser = async(req, res, next) => {
        console.log(req.session.user);
        let user = req.session.user;
        let documents = await db.collection('documents').find({ user: user }).toArray()
            .then(function(querySnapshot) {
                return querySnapshot.docs;
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });


        if (documents) {
            res.locals.documents = documents;
            next();

        }

    }

    const add = async(req, res) => {
        /**
         * GET THE FILE FROM THE REQUEST
         */
        let document = req.body;
        /**
         *  CREATE DOCUMENT OBJECT
         */

        console.log('ADDING DOCUMENT TO DATABASE')
        console.log(document);
        let doc = await db.collection('documents').add(document)
            .then(function(docRef) {
                return docRef;
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });

        if (doc) {
            res.status(200);
            res.send(doc);
        } else {
            res.status(500);
            res.send('Failed');
        }
    }

    const update = async(req, res) => {
        let id = req.params.id;
        let document = req.body;
        let doc = await db.collection('documents').doc(id).update(document)
            .then(function(docRef) {
                return docRef;
            })
            .catch(function(error) {
                console.error("Error updating document: ", error);
            });

        if (doc) {
            res.status(200);
            res.send(doc);
        } else {
            res.status(500);
            res.send('Failed');
        }
    }

    const del = async(req, res) => {
        let id = req.params.id;
        let doc = await db.collection('documents').doc(id).delete()
            .then(function(docRef) {
                return docRef;
            })
            .catch(function(error) {
                console.error("Error deleting document: ", error);
            });

        if (doc) {
            res.status(200);
            res.send(doc);
        } else {
            res.status(500);
            res.send('Failed');
        }
    }

    return {
        get: get,
        getById: getById,
        getUnapproved: getUnapproved,
        getByUser: getByUser,
        add: add,
        update: update,
        del: del,
        upload: upload

    }


}

exports.documentsController = documentsController;