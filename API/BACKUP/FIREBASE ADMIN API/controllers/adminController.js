let Admin = require('../config').admin;
let dbURI = require('../config').dbURI;
const db = require('../db/database').connection;
let User = require('../models/user')
let docModel = require('../models/documents').Document;
let ObjectID = require('mongoose').Types.ObjectId;
let storageConfig = require('../config').storageConfig;


/**
 * UPLOADER MIDDLWARE
 * */
const uploadFile = require("../middlewares/upload");
const { Document } = require('../models/documents');


exports.uploadFile = uploadFile;

/**
 * Add a new User & Firebase Account
 * */
exports.addUser = async(req, res) => {
    /**
     * Get the user data from the request
     * */
    let userData = req.body;

    /**
     * Create a new user
     * */
    let user = new User({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        uid: userData.uid,
        password: userData.password
    });

    /**
     * Create a new firebase account
     * */
    try {
        let userRecord = await Admin.auth().createUser({
            email: userData.email,
            password: userData.password,
            displayName: userData.name,
            phoneNumber: userData.phone,
            disabled: false
        });
        console.log('Successfully created new user:', userRecord.uid);
    } catch (error) {
        console.log('Error creating new user:', error);
    }

    /**
     * Save the user to the database
     * */
    user.save((err, user) => {
        if (err) {
            console.log(err);
            req.flash('error', 'Could not add user');
            res.redirect('/clients/add');
        } else {
            req.flash('success', 'User added successfully');
            res.redirect('/clients');
        }
    });
}

module.exports = exports;
exports.uploadFile = uploadFile;

/**
 * Add a new User & Firebase Account
 * */


exports.addUser = async(req, res) => {

    let userData = req.body;
    let user = new User({

        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        uid: userData.uid,
        password: userData.password
    });

    try {
        let userRecord = await Admin.auth().createUser({
            email: userData.email,
            password: userData.password,
            displayName: userData.name,
            phoneNumber: userData.phone,
            disabled: false
        });
        console.log('Successfully created new user:', userRecord.uid);
    } catch (error) {
        console.log('Error creating new user:', error);
    }

    user.save((err, user) => {


            if (err) {
                console.log(err);
                req.flash('error', 'Could not add user');
                res.redirect('/clients/add');
            } else {
                req.flash('success', 'User added successfully');
                res.redirect('/clients');
            }
        }

    );
}


module.exports = exports;