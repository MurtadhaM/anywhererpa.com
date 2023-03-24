let express = require("express");
const config = require("./config");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
var logger = require('morgan');
const cors = require('cors')
let bodyParser = require("body-parser");
let userRouter = require('./routes/userRouter');
let documentsRouter = require('./routes/documentsRouter');
let path = require("path");
const MongoStore = require("connect-mongo");
const PORT = config.PORT;
const flash = require('connect-flash');


/**
 * Session Store
 */


let app = express();
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

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


/**
 * Main Router
 */
const mainRouter = require('./routes/mainRouter').mainRouter;
/**
 *  CSRF PROTECTION
 */
const csrfProtection = csrf({ cookie: true });


/**
 * MIDDLEWARE
 */
let checkAuth = require('./middlewares/auth').checkAuth;
// Express


/**
 * FLASH ERROR MESSAGES
 */
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    console.log(res.locals.flashMessages);
    next();
});


/**
 * SESSION STORE
 * */

const sessionStore = new MongoStore({
    mongoUrl: config.dbURI,
    ttl: 60 * 60 * 24 * 7,
    autoRemove: 'native',
    autoRemoveInterval: 10,
    collection: 'sessions'
});


/**
 * SESSION
 */
app.use(session({
    httpOnly: true,
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 60 * 60 * 24 * 7 * 1000,
        sameSite: false,
        secure: false

    }

}));



/**
 * FLASH MESSAGES MIDDLEWARE FOR ALL ROUTES
 */
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    res.locals.successMessages = req.flash('success_msg');
    res.locals.user = req.session.user;
    res.locals.errorMessages = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});






/**
 * VIEW ENGINE
 */
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));
app.use(checkAuth);




// /**
//  * CSRF TOKEN
//  * */
// app.use(csrfProtection);

// app.all("*", (req, res, next) => {
//     res.cookie("XSRF-TOKEN", req.csrfToken());
//     next();
// });



/**
 * Main Router
 */
app.use('/', mainRouter);
/**
 * Dashboard Router 
 */
app.use('/', require('./routes/dashboardRouter').dashboardRouter);

// Routes
//app.use('/api/users', userRouter);
app.use('/documents', documentsRouter);


// Server
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});

console.log('API is running on port 3000');