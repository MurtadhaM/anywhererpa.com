let config = require("../config");
const express = require('express');
const app = express();
const User = require("../models/user");
const Document = require("../models/documents");
let dashboardRouter = express.Router();
let sessionStore = require('connect-mongo');
const upload = require('../middlewares/upload');
var ObjectID = require('mongodb').ObjectID;
/**
 * Dashboard page
 * */


const session = require('express-session');
const MongoStore = require("connect-mongo");
const PORT = config.PORT;
const { checkAuth } = require("../middlewares/auth");
const { ObjectId } = require("mongodb");
const documentsController = require("../controllers/documentsController")(config.admin);






dashboardRouter.route('/dashboard').get((req, res) => {
    if (req.session.user) {

        res.render('dashboard');
    } else {


        res.redirect('/login');


    }
})


/**
 * Admin page
 * */
dashboardRouter.route('/admin').get((req, res, next) => {


    /*
     * Check if user is admin
     */
    if (req.session.role === "admin") {
        console.log('User is admin' + req.session.user.role);
        let users = User.find({ role: "admin" }).then((users) => {

            res.render('admin', { users: users });
        })
    } else {
        console.log('User is not admin' + req.session.user.role);

        console.log(req.session)

        res.redirect('/dashboard');
    }





});

/**
 * DOCUMENT UPLOAD
 */




/**
 * Clients page
 *  */
dashboardRouter.route('/clients').get(async(req, res) => {
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

});

/**
 * Documents page
 * */
dashboardRouter.route('/documents').get(checkAuth, async(req, res) => {

    /** 
     * GET ALL DOCUMENTS WHERE USER ID = CURRENT USER ID
     */

    if (req.session.user) {
        console.log(req.session.user.email);
    } else {
        console.log('No user');
    }

    let documents = await Document.find({ uid: req.session.user.uid }).then((documents) => {
        res.render('documents', { documents: documents });
    }).catch((err) => {
        flash(req, {
            "error": "Error getting documents"
        });
        console.log(err);
    });


});


dashboardRouter.route('/documents/:id').get(checkAuth, async(req, res) => {
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
})

async function deleteOneDocumentFromUser(_id) {
    let objId = new ObjectID(_id);
    let doc = await Document.findOneAndDelete({ _id: objId }).then((documents) => {
        if (documents) {
            documents.remove();

            User.findOneAndUpdate({
                uid: documents.uid
            }, { $pull: { documents: documents._id } }, { new: true }, (err, doc) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(doc);
                }
            });

            console.log({ 'User Docs': documents })


            res.status(200).json({ documents: documents });
        } else {
            res.status(494).json({
                'message': 'Document not found'
            })
        }

    })
}


async function deleteDocumentFromUser(_id) {
    let objId = new ObjectID(_id);
    let doc = await Document.findOneAndDelete({ _id: objId }).then((documents) => {
        if (documents) {
            documents.remove();

            User.findOneAndUpdate({
                uid: documents.uid
            }, { $pull: { documents: documents._id } }, { new: true }, (err, doc) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(doc);
                }
            });

            console.log({ 'User Docs': documents })

        }
    })
}


dashboardRouter.route('/documents/:id').delete(checkAuth, async(req, res) => {
    let _id = req.params.id;

    if (_id) {
        let deletedDoc = await deleteDocumentFromUser(_id);

        let objId = new ObjectID(_id);
        let doc = await Document.findOneAndDelete({ _id: objId }).then((documents) => {
            if (documents) {
                documents.remove();

                User.findOneAndUpdate({
                    uid: documents.uid
                }, { $pull: { documents: documents._id } }, { new: true }, (err, doc) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(doc);
                    }
                });

                console.log({ 'User Docs': documents })


                res.status(200).json({ documents: documents });
            } else {
                res.status(494).json({
                    'message': 'Document not found'
                })
            }


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
})



/**
 * Settings page
 * */
dashboardRouter.route('/settings').get((req, res) => {
    res.render('settings');
});

/**
 * Clients page - add client 
 * Clients page - edit client
 * */
dashboardRouter.route('/clients/:id').get(async(req, res) => {
    // Get client by id
    console.log(req.params.id);
    let user = await User.findById(req.params.id).then((user) => {
        return user;
    }).catch((err) => {
        console.log(err);
    });

    if (user) {
        res.render('client/edit', { user: user });
    } else {

        res.redirect('/clients');
    }

})



/**
 * ALL OTHER ROUTES
 * */

exports.dashboardRouter = dashboardRouter;