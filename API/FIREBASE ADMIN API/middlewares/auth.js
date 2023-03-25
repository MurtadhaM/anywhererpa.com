const admin = require('firebase-admin');
const User = require('../models/user');
const PUBLIC_ROUTES = require('../config').PUBLIC_ROUTES;
const ADMIN_ROUTES = require('../config').ADMIN_ROUTES;

/**
 * Check Role
 */

/**
 * getRole
 */
let getRole = async(decodedClaims) => {
    let role = 'user';
    let user = await User.findOne({ email: decodedClaims.email });
    if (user) {
        console.log('The user role is: ' + user.role + '')
        role = user.role;
    }
    return role;
}



let isAdmin = (req, res, next) => {
    if (req.session.role === "admin") {
        next();
    } else {
        res.redirect('/dashboard');
    }
}


/**
 *  isGuest
 */
let isGuest = (req, res, next) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        next();
    }
}

/**
 * isAuth
 */
let isAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}





/** 
 * 
 *  Create a Session Cookie with the Firebase ID Token.
 */
async function createSessionCookie(req, res) {
    const idToken = req.body.idToken.toString() || '';
    console.log('Creating a session cookie with the Firebase ID token: ' + idToken);
    /**
     * Check if the ID token is valid.
     */

    if (!idToken || idToken === 'undefined' || idToken === 'null' || idToken === '') {
        res.status(401).send('UNAUTHORIZED REQUEST!');
        return;
    }
    let expiresIn = 60 * 60 * 24 * 5 * 1000;
    let storage = 'session';
    admin
        .auth()
        .createSessionCookie(idToken, { expiresIn }, storage)

    .then(
        (sessionCookie) => {
            res.cookie("token", sessionCookie, { maxAge: expiresIn, httpOnly: true }, { sameSite: 'none', secure: true });
            console.log('session cookie created successfully', sessionCookie);
            req.session.token = sessionCookie;
            admin.auth().verifySessionCookie(sessionCookie, true).then((decodedClaims) => {
                console.log('session cookie verified successfully');
                console.log(decodedClaims);


                console.log('user added to session');
                /**
                 * ADD ROLE TO SESSION
                 */
                let role = getRole(decodedClaims).then((role) => {
                    req.session.role = role;
                    req.session.user = decodedClaims;
                    res.locals.user = decodedClaims;
                    res.locals.role = role;
                    req.session.save();
                    console.log('session saved');
                }).catch((error) => {
                    console.log(error);
                    res.status(401).send('UNAUTHORIZED REQUEST!');
                });


                res.status(200).send('SUCCESS');

            }).catch((error) => {
                console.log(error);
                res.status(401).send('UNAUTHORIZED REQUEST!');
            });
        },
        (error) => {
            console.log(error);

            res.status(401).send('UNAUTHORIZED REQUEST!');
        }

    )

}



function checkAuth(req, res, next) {
    /**
     * PRINT SESSION
     */
    console.log('CHECKING AUTH');
    /**
     * CHECK IF ROUTE IS PUBLIC
     * */
    if (PUBLIC_ROUTES.includes(req.path)) {
        console.log('PUBLIC ROUTE');
        next();
        return;
    } else

    /**
     * CHECK IF ROUTE IS ADMIN
     * */
    if (ADMIN_ROUTES.includes(req.path)) {
        console.log('ADMIN ROUTE');
        if (req.session.role === 'admin') {
            next();
            return;
        } else {
            res.status(401).redirect('/dashboard');
            return;
        }
    } else


    /**
     * Check Token
     * */
    if (!req.session.token || req.session.token === 'undefined' || req.session.token === 'null' || req.session.token === '') {
        res.status(401).redirect('/login');
        return;
    }

    next()


}

/**
 * 
 * Check if the session cookie is present.
 * */
function checkSessionCookie(req, res, next) {
    // Check if request is authorized with Firebase ID token.
    let sessionCookie = req.cookies.token || req.session.token || '';
    /**
     * ADD ROLE TO SESSION
     *  */

    if (sessionCookie) {
        admin.auth().verifySessionCookie(sessionCookie, true).then((decodedClaims) => {
            console.log('session cookie verified successfully');
            console.log('user added to session');
            req.session.user = decodedClaims;
            res.locals.user = decodedClaims;
            res.locals.token = sessionCookie;
            res.locals.role = getRole(decodedClaims);
            req.session.save();

        }).catch((error) => {
            console.log(error);

        });

    }

    if (!req.session.token || req.session.token === 'undefined' || req.session.token === 'null' || req.session.token === '') {
        next();
    } else {
        res.status(401).redirect('/dashboard');
        return;
    }

}


exports.checkAuth = checkAuth;
exports.createSessionCookie = createSessionCookie;