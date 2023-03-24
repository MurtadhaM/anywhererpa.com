let express = require('express'); // Load Express
// Initialize Firebase
let config = require("../config"); // Load Firebase
let admin = config.admin;
let upload = require('../middlewares/upload');
const User = require('../models/user');
let docModel = require('../models/documents').Document;
let ObjectID = require('mongoose').Types.ObjectId;
let documentsController = require('./../controllers/documentsController').documentsController(admin);

let documentsRouter = express.Router();


documentsRouter.route('/').get(documentsController.get);

documentsRouter.route('/upload').post(upload.single('file'), async(req, res) => {
    try {
        console.log('The file: ');
        console.log(req.file);

        let document = new docModel({
            name: req.file.originalname,
            path: req.file.path,
            type: req.file.mimetype,
            size: req.file.size,
            user: new ObjectID(getCurrentUser(req.body.email)._id),
            date: new Date(),
            email: req.session.user.email,
            uid: req.session.user.uid
        });


        console.log('Adding document to database');

        await document.save()
            /**
             * UPDATE THE USER DOCUMENTS ARRAY
             * */
        await updateUserDocuments(req.session.user.email, document);
    } catch (err) {
        console.log(err);
        req.flash('error', 'Error uploading document');
        res.redirect('/documents');
        return;
    }


    /**
     * SEND RESPONSE TO CLIENT
     */
    req.flash('success', 'Document uploaded successfully');
    res.redirect('/documents');
});





documentsRouter.route('/unapproved').get(documentsController.getUnapproved);
documentsRouter.route('/:id').get(documentsController.getById).put(documentsController.update).patch(documentsController.update).delete(documentsController.del);

/**
 * GET CURRENT USER
 */

async function getCurrentUser(email) {
    let user = await User.findOne({ email: email });
    return user;
}

/**
 * UPDATE THE USER DOCUMENTS ARRAY
 */

async function updateUserDocuments(email, document) {
    let user = await User.findOne({
        email: email
    });
    user.documents.push(document.name);
    await user.save();
}



module.exports = documentsRouter;