let express = require('express'); // Load Express
// Initialize Firebase
let config = require("../config"); // Load Firebase
let admin = config.admin;
let upload = require('../middlewares/upload');
const User = require('../models/user');
let docModel = require('../models/documents');
let ObjectID = require('mongoose').Types.ObjectId;
let documentsController = require('./../controllers/documentsController')(admin);
const flash = require('express-flash-notification');
let documentsRouter = express.Router();


documentsRouter.route('/upload').post(upload.single('file'), async(req, res) => {
    try {

        let document = new docModel({
            name: req.file.originalname,
            path: req.file.path,
            type: req.file.mimetype,
            size: req.file.size,
            user: new ObjectID(req.session.user._id),
            date: new Date(),
            email: req.session.user.email,
            uid: req.session.user.uid
        });

        console.log('Adding document to database');

        await document.save()

        await updateUserDocuments(req.session.user.email, document);
    } catch (err) {
        console.log(err);

        res.redirect('/documents');
        return;
    }
    res.redirect('/documents');
});

documentsRouter.route('/:id').get(
    (req, res) => {
        let userDocuments = req.params.id;

        /**
         * GET THE DOCUMENT FROM THE DATABASE for the user
         */

        let documents = documents.find({ user: userDocuments }, (err, documents) => {
            console.log('Documents: ');
            console.log(documents);
            res.render('documents', {
                title: 'Documents',
                documents: documents,
                user: req.session.user
            });



        });


        //


        res.send('Document uploaded successfully with id: ' + documents + ' and user: ' + userDocuments);
    })



documentsRouter.route('/unapproved').get(documentsController.getUnapproved);
documentsRouter.route('/:id').get(documentsController.getById).put(documentsController.update).patch(documentsController.update).delete(documentsController.del);



module.exports = documentsRouter;