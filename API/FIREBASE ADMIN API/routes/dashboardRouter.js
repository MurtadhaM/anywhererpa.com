const express = require('express');
const dashboardRouter = express.Router();
const clientController = require('../controllers/clientController');

/**
 * Dashboard page
 * */
const dashboardController = require("../controllers/dashboardController");


dashboardRouter.route('/dashboard').get(async(req, res) => {
    res.render('dashboard');
});


/**
 * Admin page
 * */
dashboardRouter.route('/admin').get(dashboardController.admin)
    /**
     * DOCUMENT UPLOAD
     */



/**
 * Clients page
 *  */
dashboardRouter.route('/clients').get(dashboardController.clients);
dashboardRouter.get('/clients/add', (req, res) => {
    res.render('client/add');
});
dashboardRouter.route('/clients/:id').get(clientController.getClientByID);
dashboardRouter.route('/clients/:id').delete(clientController.deleteClient);
dashboardRouter.route('/clients/:id').post(clientController.addClient);
/**
 * Documents page
 * */
dashboardRouter.route('/documents').get(dashboardController.documents);
dashboardRouter.route('/documents/:id').get(dashboardController.getDocumentByID);
dashboardRouter.route('/documents/:id').delete(dashboardController.deleteDocumentByID);
dashboardRouter.route('/settings').get((dashboardController.getSettings));


exports.dashboardRouter = dashboardRouter;
module.exports = dashboardRouter;