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
 * get all agents
 * */

exports.getClients = async(req, res) => {

    try {

        let clients = await User.find({ role: "user" })
        res.render('clients', { clients: clients });

    } catch (err) {
        console.log(err);
    }

}


/**
 * Edit a Client
 * */
exports.editClient = async(req, res) => {
    /**
     * Get client id & the new Object
     */
    let id = req.params.id;
    let newClient = req.body;

    /**
     * Find the client by id
     * */
    let client = await User.findById(id).then((client) => {
        return client;
    }).catch((err) => {
        console.log(err);
    });


    /**
     * Update the client
     * */

    User.updateOne({ _id: id }, newClient).then((result) => {

        res.redirect('/dashboard/clients');
    }).catch((err) => {
        console.log(err);

    })
}

/**
 * Delete a client
 * */
exports.deleteClient = async(req, res) => {

    /**
     * Get client id
     */
    let id = req.params.id;

    if (!id) {

        res.redirect('/dashboard/clients');
    }

    /**
     * Find the client by id
     * */
    let client = await User.findById(id).then((client) => {
        return client;
    }).catch((err) => {
        console.log(err);
    });



    let firebaseUser = await Admin.auth().getUserByEmail(client.email).then(function(userRecord) {
        console.log('Successfully fetched user data:', userRecord.toJSON());
        return userRecord;
    }).catch(function(error) {
        console.log('User Not Found:', error);
        return error;
    });

    if (firebaseUser.uid) {
        // Delete THE USER



        Admin.auth().deleteUser(firebaseUser.uid)
            .then(function() {
                console.log('Successfully deleted user');
                User.deleteOne({ uid: client.uid }).then((result) => {
                    res.redirect('/dashboard/clients');
                }).catch((err) => {
                    console.log(err);
                })
            })
            .catch(function(error) {
                console.log('Error deleting user:', error);
            });
    }

}









/**
 * Add a client
 * */
exports.addClient = async(req, res) => {
    let newClient = req.body || {};

    console.log(newClient);
    if (!newClient) {

        res.redirect('/dashboard/clients');
    }

    /**
     * ADD Firebase user
     */

    const userRecord = Admin.auth().createUser({
            email: newClient.email,
            emailVerified: true,
            password: newClient.password,
            displayName: newClient.name,
            disabled: false
        })
        .then(function(userRecord) {


            console.log('Successfully created new user:', userRecord.uid);
            /**
             * Update the client 
             */

            newClient.uid = userRecord.uid;
            let client = User.create(newClient).then((client) => {
                    return client;
                }

            ).catch((err) => {

                console.log(err);
            })

            return userRecord;
        })
        .catch(function(error) {

            console.log(error);
        });

    res.redirect('/clients');
}



exports.getClientByID = async(req, res) => {

    let id = req.params.id;
    let client = await User.findById(id).then((client) => {
        return client;
    }).catch((err) => {
        console.log(err);
    });

    res.render('client/edit', { client: client });
}