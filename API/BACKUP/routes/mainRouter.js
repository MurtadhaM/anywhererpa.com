let config = require("../config");
const express = require('express');
const MongoStore = require("connect-mongo");
const userRouter = require("./userRouter");
let mainRouter = express.Router();
let auth = require('../middlewares/auth').createSessionCookie;
/**
 * Home page
 */
mainRouter.route('/').get((req, res) => {
    res.render('index');
});





mainRouter.route('/logout').get((req, res) => {
    console.log('Destroying session...');
    try {
        req.session.destroy();
        res.clearCookie('session');
        res.clearCookie('user');
        res.redirect("/login");
    } catch (err) {
        console.log(err);
        res.redirect("/login");
    }
});





/**
 * Login user
 */
mainRouter.route('/login').get((req, res) => {
        res.render('login');
    })
    .post((req, res) => {
        console.log(req.body.user.stsTokenManager.accessToken);
        const idToken = req.body.idToken || req.body.user.stsTokenManager.accessToken || '';
        const user = req.body.user || '';
        /**
         * Create session cookie
         * */
        console.log('Creating session cookie...');
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        const sessionStore = MongoStore.create({
            mongoUrl: config.dbURI,
            ttl: 60 * 60 * 24 * 7,
        });
        config.admin.auth().createSessionCookie(idToken, { expiresIn })
            .then((sessionCookie) => {
                // Set cookie policy for session cookie.
                req.flash('success', 'You are now logged in!');
                /**
                 * Get User 
                 */
                config.admin.auth().verifyIdToken(idToken).then((decodedToken) => {
                        console.log('TRYING TO GET USER');
                        console.log('Decoded Token: ', decodedToken);
                        res.locals.user = (decodedToken)
                        req.session.user = (decodedToken);
                        req.session.cookie.maxAge = expiresIn;
                        req.session.save();
                        /**
                         * Encrypt cookie
                         */



                        res.cookie("user", decodedToken.email, { maxAge: expiresIn, httpOnly: true }, sessionStore);
                        res.cookie("session", sessionCookie, { maxAge: expiresIn, httpOnly: true }, sessionStore);
                        res.status(301).redirect('/admin');
                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(401).send('UNAUTHORIZED REQUEST!');
                    });
            }) // end of createSessionCookie
    })




exports.mainRouter = mainRouter;