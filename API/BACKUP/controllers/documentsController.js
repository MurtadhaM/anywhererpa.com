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
        let sessionCookie = req.cookies.session || '';

        if (sessionCookie === '') {
            res.status(401);
            res.send('Unauthorized');
        }

        /**
         * VERIFY SESSION COOKIE
         * */

        try {
            let user = await Admin.auth().verifySessionCookie(sessionCookie, true).then((decodedToken) => {
                // THIS IS THE UID OF THE CURRENT USER
                console.log('THE USER FOR THE IMAGE' + decodedToken.uid);
                return decodedToken;
            }).catch((error) => {
                console.log(error);
            });

            /**
             * SEARCH FOR USER IN DATABASE
             */

            let SelectedUser = await User.findOne({ email: user.email }).then((user) => {
                // console.log('USER FOUND IN DATABASE: ' + user);
                return user;
            }).catch((err) => {
                console.log(err);
            });


            /**
             * CHECK IF USER EXISTS
             */
            if (!SelectedUser) {
                res.status(404);
                res.send('User not found');
            } else {
                console.log('USER FOUND: ' + SelectedUser);
            }

            /**
             * UPLOAD FILE
             *  - Check if file is valid (size, type) 
             * - Save file to uploads folder
             * - Save file to database
             * - Return file object
             *  */

            await uploadFile(req, res);
            /**
             * LOG FILE INFO
             */
            console.log(req.file);

            if (req.file == undefined) {
                return res.status(400).send({ message: "Please upload a file!" });
            }

            /**
             *  CREATE DOCUMENT OBJECT 
             */
            let document = new docModel({
                name: req.file.originalname,
                path: req.file.path,
                type: req.file.mimetype,
                size: req.file.size,
                user: new ObjectID(user._id),
                email: user.email,
                uid: user.uid,
                date: new Date(),
                approved: false,


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
            SelectedUser.updateOne({ documents: UserDocuments }).then((user) => {
                console.log('USER DOCUMENTS UPDATED: ');
            }).catch((err) => {
                console.log(err);
            });

            console.log('ADDED DOCUMENT TO DATABASE')
                /**
                 * SAVE DOCUMENT TO DATABASE
                 * */
            document.save().then((doc) => {
                console.log(doc);
                res.status(200);
                res.send({ message: "Uploaded the file successfully: " + req.file.originalname });
            }).catch((err) => {
                console.log(err);
                res.status(500);
                res.send({ message: `Could not upload the file: ${req.file} ${err}` });
            });
        } catch (error) {
            console.log(error);
            res.status(500);
            res.send({ message: `Could not upload the file: ${req.file} ${error}` });
        }
    }





    const get = async(req, res) => {

        let documents = await db.collection('documents').find({}).toArray()
            .then(function(documents) {
                console.log(documents);
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
        let documents = await Admin.firestore().collection('documents').where('approved', '==', false).get()
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

    const getByUser = async(req, res) => {
        let user = req.params.user;
        let documents = await Admin.firestore().collection('documents').where('user', '==', user).get()
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

    const add = async(req, res) => {
        let document = req.body;
        let doc = await Admin.firestore().collection('documents').add(document)
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
        let doc = await Admin.firestore().collection('documents').doc(id).update(document)
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
        let doc = await Admin.firestore().collection('documents').doc(id).delete()
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