let config = require("../config");
const express = require('express');
let mainRouter = express.Router();
let auth = require('../middlewares/auth').createSessionCookie;
/**
 * Home page
 */
mainRouter.route('/').get((req, res) => {
    res.render('index');
});


/**
 * Login user
 */
mainRouter.route('/login').get((req, res) => {
        res.render('login');
    })
    .post((req, res) => {
        const idToken = req.body.idToken || '';
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        config.admin.auth().createSessionCookie(idToken, { expiresIn })
            .then((sessionCookie) => {
                // Set cookie policy for session cookie.
                console.log('Cookie created successfully!');
                const options = { maxAge: expiresIn, httpOnly: true, secure: true };
                res.cookie('session', sessionCookie, options);
                res.status(200).send('Login Successful!');
            }, (error) => {
                console.log(error);
                res.status(401).send('Login Failed!');
            });

    })

exports.mainRouter = mainRouter;