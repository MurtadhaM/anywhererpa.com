let config = require("../config");
const express = require('express');
const User = require("../models/user");
let dashboardRouter = express.Router();


/**
 * Dashboard page
 * */

dashboardRouter.route('/dashboard').get((req, res) => {
    res.render('dashboard');
});

/**
 * Admin page
 * */
dashboardRouter.route('/admin').get((req, res) => {
    res.render('admin');
});

/**
 * Profile page
 * */
dashboardRouter.route('/profile').get((req, res) => {
    res.render('profile');
});


/**
 * Clients page
 *  */
dashboardRouter.route('/clients').get(async(req, res) => {
    const clients = await User.find({ role: "user" });
    console.log(clients);
    res.render('clients', { clients: clients });
    // Get all useres where role =user

});

/**
 * Documents page
 * */
dashboardRouter.route('/documents').get((req, res) => {
    res.render('documents');
});


/**
 * Logout user
 * */
dashboardRouter.route('/logout').get((req, res) => {
    res.clearCookie('session');
    res.clearCookie('user');
    res.redirect("/login");
});

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
dashboardRouter.route('/clients/:id').get((req, res) => {
    // Get client by id
    console.log(req.params.id);
    let user = User.findById(req.params.id).then((user) => {
        // See the tables below for the contents of userRecord
        console.log(user);
        return user;
    }).catch(function(error) {
        // See the tables below for the contents of error
        let err = error
        return err;
    });

    if (user.uid) {
        res.status(200);
        res.send(user);
    }

    user.then((user) => {
        res.render('client/edit', { user: user });
    });


})



exports.dashboardRouter = dashboardRouter;