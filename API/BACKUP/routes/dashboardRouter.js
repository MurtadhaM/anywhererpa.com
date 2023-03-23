let config = require("../config");
const express = require('express');
const app = express();
const User = require("../models/user");
let dashboardRouter = express.Router();
let sessionStore = require('connect-mongo');


/**
 * Dashboard page
 * */


const session = require('express-session');
const MongoStore = require("connect-mongo");
const PORT = config.PORT;
const flash = require('connect-flash');


/**
 * Session Store
 * */


app.use(session({
    httpOnly: true,
    secret: config.SESSION_SECRET,

    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: config.dbURI,
        ttl: 60 * 60 * 24 * 7,
    }),
    cookie: {
        maxAge: 60 * 60 * 24 * 7 * 1000,
        sameSite: false,
        secure: false
    }
}));

app.use(flash());

/**
 * FLASH MESSAGES MIDDLEWARE FOR ALL ROUTES
 * */
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    res.locals.successMessages = req.flash('success_msg');
    res.locals.user = req.session.user;
    res.locals.errorMessages = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});




dashboardRouter.route('/dashboard').get((req, res) => {
    if (req.session.user) {
        req.flash('info', 'Dashboard');
        res.render('dashboard');
    } else {
        req.flash('error', 'Please login to view this page');

        res.redirect('/login');


    }
})



/**
 * Admin page
 * */
dashboardRouter.route('/admin').get((req, res) => {

    req.flash('info, ${req.user.email}');

    sessionStore.get(req.sessionID, function(err, session) {
        if (err) {
            console.log(err);
            req.flash('error', 'admin page error');
            res.redirect('/login');
        } else {
            console.log(session);
        }

    });



    res.render('admin');
});

/**
 * Profile page
 * */

/**
 * Clients page
 *  */
dashboardRouter.route('/clients').get(async(req, res) => {
    const clients = await User.find({ role: "user" });

    req.flash('success', 'Got all clients')


    res.render('clients', { clients: clients });

    // Get all useres where role =user

});

/**
 * Documents page
 * */
dashboardRouter.route('/documents').get((req, res) => {
    req.flash('info', 'Documents');
    res.render('documents');
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