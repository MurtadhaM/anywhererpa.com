let express = require('express'); // Load Express
// Initialize Firebase
let config = require("../config"); // Load Firebase
let admin = config.admin;
let upload = require('../middlewares/upload');
const User = require('../models/user');
let docModel = require('../models/documents');
let ObjectID = require('mongoose').Types.ObjectId;
let documentsController = require('./../controllers/documentsController')
const flash = require('express-flash-notification');
const router = require('../API/documents');
let documentsRouter = express.Router();


// documentsRouter.route('/upload').post(upload.single('file'), async(req, res) => {


//             documentsRouter.route('/:id').get(
//                 (req, res) => {
//                     let userDocuments = req.params.id;

//                     /**
//                      * GET THE DOCUMENT FROM THE DATABASE for the user
//                      */

//                     let documents = documents.find({ user: userDocuments }, (err, documents) => {
//                         console.log('Documents: ');
//                         console.log(documents);
//                         res.render('documents', {
//                             title: 'Documents',
//                             documents: documents,
//                             user: req.session.user
//                         });



//                     });


//                     //


//                     res.send('Document uploaded successfully with id: ' + documents + ' and user: ' + userDocuments);
//                 })



//             documentsRouter.route('/unapproved').get(documentsController.getUnapproved);
//             documentsRouter.route('/:id').get(documentsController.getById).put(documentsController.update).patch(documentsController.update).delete(documentsController.del);

//             });


router.route('/upload', upload.single('file'), documentsController.upload);


documentsRouter = documentsRouter;
// modules.exports = documentsRouter