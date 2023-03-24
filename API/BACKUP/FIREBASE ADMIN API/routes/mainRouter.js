let config = require("../config");
const express = require('express');
const MongoStore = require("connect-mongo");
const userRouter = require("./userRouter");
const { TokenLogin, createSessionCookie } = require("../middlewares/auth");
let mainRouter = express.Router();
let auth = require('../middlewares/auth').createSessionCookie;
/**
 * Home page
 */

mainRouter.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

/**
 * Login page
 * */

mainRouter.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

/**
 * Login page
 * */

mainRouter.post('/login', createSessionCookie)


/**
 * Logout page
 * */

mainRouter.get('/logout', (req, res) => {
    console.log(req.session)
    res.clearCookie('session');
    req.session.destroy();
    res.user = null;
    res.redirect('/');


});


exports.mainRouter = mainRouter;