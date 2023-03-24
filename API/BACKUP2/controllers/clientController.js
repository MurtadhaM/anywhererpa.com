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

let getClients = async(req, res) => {
    if (!req.session.user) {

        res.redirect('/login');
        return
    }


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
let editClient = async(req, res) => {
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
let deleteClient = async(req, res) => {

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

    /**
     * Delete the client
     * */

    let deletedUser = await User.deleteOne({ _id: id }).then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });


}


/**
 * Add a client
 * */
let addClient = async(req, res) => {
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
            // See the tables below for the contents of userRecord  

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
            // See the tables below for the contents of error
            console.log(error);
        });

    /**
     * Add user to database
     * */


    /**
     * Update the client 
     */



    res.redirect('/clients');
}


module.exports = {
    getClients,
    editClient,
    deleteClient,
    addClient
}