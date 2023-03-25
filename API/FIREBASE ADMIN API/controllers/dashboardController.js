let User = require('../models/user')
let Document = require('../models/documents');


/**
 * get all 
 * mins
 * */

exports.admin = async(req, res) => {

    try {

        let users = await User.find({ role: "admin" })
        res.render('admin', { users: users });

    } catch (err) {
        console.log(err);
    }

}


/**
 * GET ALL CLIENTS
 * */

exports.clients = async(req, res) => {
    const clients = await User.find({ role: "user" });
    let users = User.find({ role: "user" }).then((users) => {
        // See the tables below for the contents of userRecord
        res.locals.users = users;
    }).catch(function(error) {
        // See the tables below for the contents of error
        console.log(error);
        let err = error;
    });
    res.render('clients', { users: clients });

}

/**
 * GET ALL DOCUMENTS
 * */

exports.documents = async(req, res) => {
    let role = req.session.role;
    let documents = [];
    // If the user is an admin, get all documents
    if (role == "admin") {
        documents = await Document.find({}).then((documents) => {
            return documents;
        }).catch((err) => {
            flash(req, {
                "error": "Error getting documents"
            });
            console.log(err);
        });

        // If the user is a client, get all documents where the user id = the current user id
    } else if (role == "user") {
        documents = await Document.find({ uid: req.session.user.uid }).then((documents) => {
            return documents;
        }).catch((err) => {
            flash(req, {
                "error": "Error getting documents"
            });
            console.log(err);
        });
    }

    console.log(role);
    res.render('documents', { documents: documents });


}

/**
 * GET DOCUMENTS BY ID
 * */

exports.getDocumentByID = async(req, res) => {
    let uid = req.params.id;
    if (req.params.id) {

        let documents = await Document.find({ uid: uid }).then((documents) => {
            console.log({ 'User Docs': documents })

            res.status(200).json({ documents: documents });
        }).catch((err) => {
            flash(req, {
                "error": "Error getting documents"
            });
            console.log(err);
            res.status(400).send('Error getting documents');
        });


    } else {
        res.status(404).send('Not found');
    }
}

/**
 * DELETE DOCUMENTS BY ID
 * */

exports.deleteDocumentByID = async(req, res) => {
    let _id = req.params.id;
    if (_id) {
        let document = await Document.findByIdAndRemove(_id).then((document) => {
            console.log({ 'Deleted Doc': document })
            res.status(200).json({ document: document });
        }).catch((err) => {
            flash(req, {
                "error": "Error deleting document"
            });
            console.log(err);
            res.status(400).send('Error deleting document');
        });

    } else {
        res.status(404).send('Not found');
    }
}

/**
 * SETTINGS 
 * */

exports.getSettings = async(req, res) => {
    res.render('settings');
}