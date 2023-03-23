let express = require('express'); // Load Express
// Initialize Firebase
let config = require("../config"); // Load Firebase
let admin = config.admin;
let documentsController = require('./../controllers/documentsController').documentsController(admin);

let documentsRouter = express.Router();


documentsRouter.route('/').get(documentsController.get);
documentsRouter.route('/upload').put(documentsController.upload);
documentsRouter.route('/upload').post(documentsController.upload);

documentsRouter.route('/unapproved').get(documentsController.getUnapproved);
documentsRouter.route('/:id').get(documentsController.getById).put(documentsController.update).patch(documentsController.update).delete(documentsController.del);



module.exports = documentsRouter;