let Admin = require('../config').admin;
let User = require('../models/user')
let docModel = require('../models/documents')



/**
 * Add user to database
 */
let addUsersDB = async(user) => {
    let newUser = new User({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        uid: user.uid,
        password: user.password,
        status: true,
        created: Date.now(),
        updated: Date.now(),
        lastLogin: Date.now()
    });
    let savedUser = await newUser.save().then((user) => {
        console.log('User saved to database');
        return user;
    }).catch((err) => {
        console.log(err);
    });
    return savedUser;
}



let userController = (Admin) => {
    let find = async(req, res) => {
        try {
            let input = req.params.input || req.query.input || req.body.input;
            console.log(input);
            // Check if input is empty
            if (!input) {
                res.status(400);
                res.send('Bad Request');
            }
            // If the string contains an @ symbol, it's an email address
            let isEmail = input.indexOf('@') > -1;
            // IF the String is 28 bytes long, it's a UID
            let isUid = input.length === 28;
            if (isEmail) {
                getByEmail(req, res);
            } else if (isUid) {
                getById(req, res);
            } else {
                res.status(404);
                res.send({ "error": "UUID or Email not found'" });
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Get all users
    let get = async(req, res) => {
        let users = await Admin.auth().listUsers()
            .then(function(listUsersResult) {
                return listUsersResult.users;
            })
        if (users) {
            res.status(200);
            res.send(users);
        } else {
            res.status(500);
            res.send('Failed');
        }
    };


    // Add user to firebase
    let add = async(req, res) => {
        //http://localhost:3000/users/add?email=muratadha@asd.com&password=password&name=murtadha&phone=2134412231
        let email = req.body.email || req.query.email || req.params.email;
        let password = req.body.password || req.query.password || req.params.password;



        /**
         * Validate email and password
         */
        if (!email || !password) {
            res.status(400);
            res.send('Bad Request');
            return;
        }


        /**
         * Create user
         */
        let user = await Admin.auth().createUser({
                email: email,
                password: password
            })
            .then((userRecord) => {
                console.log('Successfully created new user:', userRecord.toJSON());
                /**ADD USER TO DB */
                //Clean Empty Fields
                let user = userRecord.toJSON();




                addUsersDB(user);
                return user
            })
            .catch((error) => {
                console.log(error);
                return error;
            });

        if (!user.errorInfo) {
            res.setHeader('Content-Type', 'application/json');
            res.status(201);
            res.send(user);
        } else {
            res.status(500);
            res.send({ "error": "Failed to create user due to " + user.errorInfo.message });
        }
    };

    // Get user by uid
    let getById = async(req, res) => {
        try {
            let id = req.params.id || req.query.id || req.body.id || req.params.input || req.query.input || req.body.input;
            let user = await User.find({ uid: id })
                .then((user) => {
                    return user;
                })
                .catch((err) => {
                    console.log(err);
                    return false;
                });
            if (user) {
                res.status(200);
                res.send(user);
            } else {
                res.status(404);
                res.send({ "error": "User not found" });
            }
        } catch (err) {
            console.log(err);
        }


    };


    // Update user properties
    let patch = async(req, res) => {
        let uid = req.params.id;

        let params = {};

        for (let p in req.body) {
            params[p] = req.body[p];
        }

        let user = await User.findOne({ uid: uid })
            .then(function(userRecord) {
                return userRecord.toJSON();
            })
            .catch(function(error) {
                console.log(error);
                return false;
            });

        if (user) {
            res.status(200);
            res.send(user);
        } else {
            res.status(500);
            res.send('Failed');
        }
    };

    // Get user by email
    let getByEmail = async(req, res) => {
        let email = req.body.email || req.query.email || req.params.email || req.params.input || req.query.input || req.body.input;
        console.log('Searching for user by email: ' + email)
        let user = await User.findByEmail(email)
            .then(userRecord => {
                return userRecord.toJSON();
            })

        .catch(function(error) {
            res.status(404);
            console.log(error);
            res.send(error);
        });

        if (user) {
            res.status(200);
            console.log(user);
            res.send(user);
        }
    };

    // Delete user from firebase and db
    var del = function(req, res) {

        let uid = req.params.id || req.query.id || req.body.id || req.params.input || req.query.input || req.body.input;
        Admin.auth().deleteUser(uid)
            .then(function() {
                console.log('Successfully deleted user');
            })
            .catch(function(error) {
                console.log('Error deleting user:', error);
            });

        User.deleteOne({ uid: uid }, function(err) {
            if (err) {
                res.status(500);
                res.send('Failed');
            } else {
                res.status(200);
                res.send('Success');
            }
        });
    };

    // Get user by phone
    let getByPhone = async(req, res) => {
        let phone = req.body.phone || req.query.phone || req.params.phone || req.params.input || req.query.input || req.body.input;

        let user = await User.findByPhone(phone)

        .then(userRecord => {
            return userRecord.toJSON();
        })

        .catch(function(error) {
            res.status(404);
            console.log(error);
            res.send(error);
        });

        if (user) {
            res.status(200);

            res.send(user);
        }
    };


    /**
     * Verifies Token & Returns User Data
     */
    let TokenLogin = async(req, res) => {
        const idToken = req.body.idToken || req.query.idToken || req.params.idToken || req.params.input || req.query.input || req.body.input;

        /**
         * If the session cookie is set, VERIFY the ID token.
         */
        if (idToken) {
            Admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
                console.log(decodedIdToken);

                /**
                 * Save the ID token in the session cookie.
                 *  */
                req.session.token = idToken;
                req.session.user = decodedIdToken.user;
                req.session.save();


                res.end(JSON.stringify({ status: "success" }));
                res.status(200).redirect('/dashboard');
            }).catch((error) => {
                console.log(error);
                res.flash('error', error.message);
                res.end(JSON.stringify({ status: "error" }));
            });
        } else {

            console.log(JSON.stringify({ status: "error" }));
            res.end(JSON.stringify({ status: "error" }));
        }


    }

    /**
     * Verifies Token & Returns User Data
     *  */
    let TokenVerify = async(req, res) => {
        const idToken = req.body.idToken.toString() || '';

        /**
         * If the session cookie is set, VERIFY the ID token.
         * */
        if (req.session.cookie) {
            Admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
                let uid = decodedIdToken.uid;

                /**
                 * SAVE the ID token in the session cookie.
                 * */
                req.session.token = idToken;
                res.session.user = decodedIdToken.user;
                req.session.save();

                res.end(JSON.stringify({ status: "success" }));
                res.status(200).redirect('/dashboard');
            }).catch((error) => {
                console.log(error);
                res.flash('error', error.message);
                res.end(JSON.stringify({ status: "error" }));

            });
        } else {

            console.log(JSON.stringify({ status: "error" }));
            res.end(JSON.stringify({ status: "error" }));
        }


    }


    return {
        add: add,
        getById: getById,
        getByEmail: getByEmail,
        patch: patch,
        update: patch,
        del: del,
        get: get,
        find: find,
        TokenLogin: TokenLogin,

    }
}

module.exports = userController;
exports.userController = userController;