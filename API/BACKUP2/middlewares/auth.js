const admin = require('firebase-admin');
const User = require('../models/user');

const PUBLIC_ROUTES = require('../config').PUBLIC_ROUTES;

/**
 * GET ROLE FROM MONGO DB
 */

async function getRole(user) {
    try {
        let role = await User.findOne({ email: user.email }).then((role) => {
            return role;
        }).catch((err) => {
            console.log(err);
        });

        return role.role;
    } catch (err) {
        console.log(err);
    }


}


/** 
 *  Create a Session Cookie with the Firebase ID Token.
 */
async function createSessionCookie(req, res) {
    const idToken = req.body.idToken.toString() || '';
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

                req.session.user = decodedClaims;
                res.locals.user = decodedClaims;
                res.locals.token = sessionCookie;
                console.log('user added to session');
                /**
                 * ADD ROLE TO SESSION
                 */
                req.session.role = getRole(decodedClaims).then((role) => {
                    req.session.role = role;
                    req.session.user.role = role;
                    req.session.save();
                    console.log('role added to session');
                }).catch((err) => {
                    console.log(err);

                })



                ;



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
        /** 
         * 
         * Verify the session cookie. In this case, we are verifying if the Firebase
         */


    )
}

/**
 * Verify the session cookie. In this case, we are verifying if the Firebase
 * */
function verifySessionCookie(req, res, next) {
    // Check if request is authorized with Firebase ID token.
    let sessionCookie = req.cookies.token || req.session.token || '';
    /**
     * ADD ROLE TO SESSION
     */
    if (!sessionCookie || sessionCookie === 'undefined' || sessionCookie === 'null' || sessionCookie === '') {
        next();
    } else
    if (sessionCookie) {
        admin.auth().verifySessionCookie(sessionCookie, true).then((decodedClaims) => {
            console.log('session cookie verified successfully');
            console.log('user added to session');
            req.session.user = decodedClaims;

        }).catch((error) => {
            console.log(error);

        });

    }

    if (!req.session.token || req.session.token === 'undefined' || req.session.token === 'null' || req.session.token === '') {
        res.status(401).redirect('/login');
        return;
    } else {
        next();
    }

}


const ADMIN_ROUTES = require('../config').ADMIN_ROUTES;

function checkAuth(req, res, next) {

    const sessionCookie = req.cookies.session || req.session.token || '';


    res.locals.user = req.session.user || null;
    res.locals.role = req.session.role || null;
    res.locals.token = req.session.token || null;
    res.locals.session = req.session || null;
    if (req.session.role === 'admin') {
        PUBLIC_ROUTES.push(ADMIN_ROUTES);
    }


    if (ADMIN_ROUTES.includes(req.path) && req.session.role !== 'admin') {
        console.log('Aunthentication failed for admin route')
        res.status(401).redirect('/dashboard');
        return;
    }

    /**
     * Skip the middleware if the route is excluded
     */
    if (PUBLIC_ROUTES.includes(req.path)) {
        console.log(`Skipping auth middleware for ${req.path}`)
        next();
        return;
    } else


    if (!sessionCookie || sessionCookie === 'undefined' || sessionCookie === 'null' || sessionCookie === '') {
        res.status(401).redirect('/login');
        return;
    }

    /**
     * 
     * Check if the session cookie is present.
     * */




    next();
}





exports.checkAuth = checkAuth;
exports.createSessionCookie = createSessionCookie;
exports.verifySessionCookie = verifySessionCookie;