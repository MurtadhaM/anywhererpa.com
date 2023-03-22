const admin = require('../config').admin;
const PUBLIC_ROUTES = require('../config').PUBLIC_ROUTES;

/** 
 *  Create a Session Cookie with the Firebase ID Token.
 */
function createSessionCookie(req, res) {
    const idToken = req.body.idToken.toString() || '';
    /**
     * Check if the ID token is valid.
     */

    if (!idToken || idToken === 'undefined' || idToken === 'null' || idToken === '') {
        res.status(401).send('UNAUTHORIZED REQUEST!');
        return;
    }
    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const storage = MongoStore.create({
        mongoUrl: config.dbURI,
        ttl: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: false,
        sameSite: false,

    })

    admin
        .auth()
        .createSessionCookie(idToken, { expiresIn }, storage)

    .then(
        (sessionCookie) => {



            res.cookie("token", sessionCookie, { maxAge: expiresIn, httpOnly: true }, storage);
            req.session.token = sessionCookie;
            req.session.save();

            res.end(JSON.stringify({ status: "success" }));
        },
        (error) => {
            console.log(error);
            res.flash('error', error.message);
            res.status(401).redirect('/login');
        }
    );
}

/**
 * Verify the session cookie. In this case, we are verifying if the Firebase
 * */
function verifySessionCookie(req, res, next) {
    // Check if request is authorized with Firebase ID token.
    if (!req.cookies.session) {
        res.status(401).send('UNAUTHORIZED REQUEST!');
        return;
    }
    // Verify the session cookie. In this case an additional check is added to detect
    // if the user's Firebase session was revoked, user deleted/disabled, etc.
    admin.auth().verifySessionCookie(
        req.cookies.session, true /** checkRevoked */ ).then((decodedClaims) => {
        next();
    }).catch((error) => {
        // Session cookie is unavailable or invalid. Force user to login.
        res.status(401).send('UNAUTHORIZED REQUEST!');
    });
}




function checkAuth(req, res, next) {
    const sessionCookie = req.cookies.session || '';
    /**
     * Skip the middleware if the route is excluded
     */
    if (PUBLIC_ROUTES.includes(req.path)) {
        console.log(`Skipping auth middleware for ${req.path}`)
        req.flash('success', 'You are now logged in!')
        next();
        return;
    }

    /**
     * Check if the session cookie is present.
     * */

    console.log(sessionCookie);

    if (!sessionCookie) {
        res.status(301).redirect('/login');
        return;
    }


    /**
     * Check if the session cookie is valid.
     */

    req.flash('success', 'You are now logged in!');
    console.log('Session cookie is valid!');
    req.flash('success', 'You are now logged in!');
    next();
    /**
     * The session cookie is present. Verify it.
     * */
    // admin.auth().verifySessionCookie(
    //     sessionCookie, true /** checkRevoked */ ).then((decodedClaims) => {
    //         console.log('Session cookie is valid!');
    //         next();

    //         console.log('Session cookie is valid!');
    //         next();
    //     }

    // ).catch((error) => {
    //     console.log(error);
    //     res.status(301).redirect('/login');
    // });

}

// let auth = req.headers.authorization;
// if (!auth) {
//     res.status(403).send('Unauthorized')
// }

// auth = auth.split(' ')[1];

// // Check if token is valid
// if (auth.length < 10 || auth === 'null' || auth === 'undefined' || auth === 'false') {
//     auth = false;
// }



// console.log(auth);

// if (auth) {
//     admin.auth().verifyIdToken(auth)
//         .then(() => {
//             next()
//         }).catch((err) => {
//             console.log(err);

//             res.status(403).send('Unauthorized')
//         });
// } else {
//     res.status(403).send('Unauthorized')
// }


exports.checkAuth = checkAuth;
exports.createSessionCookie = createSessionCookie;
exports.verifySessionCookie = verifySessionCookie;