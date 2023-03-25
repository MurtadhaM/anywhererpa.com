let express = require("express");
let path = require("path");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
var logger = require('morgan');
const cors = require('cors')
let bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");
const config = require("./config");
const PORT = config.PORT;
const csrfProtection = csrf({ cookie: true });


const sessionStore = new MongoStore({
    mongoUrl: config.dbURI,
    ttl: 60 * 60 * 24 * 7,
    autoRemove: 'native',
    autoRemoveInterval: 10,
    collection: 'sessions'
});



/**
 * AUTH MIDDLEWARE
 */
let checkAuth = require('./middlewares/auth').checkAuth;




const app = express();


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














/**
 * SETUP LOCALS
 */
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.role = req.session.role;
    next();
});


/**
 * ROUTES
 */


const mainRouter = require('./routes/mainRouter').mainRouter;
let userRouter = require('./routes/userRouter');
let documentsRouter = require('./routes/documentsRouter');
const dashboardRouter = require('./routes/dashboardRouter')

/**
 * Main Router
 */
app.use('/', mainRouter);
/**
 * Dashboard Router 
 */

app.use('/', dashboardRouter);



//app.use('/documents', documentsRouter);
app.use('/api/users', require('./API/users'));
//app.use('/api/documents', require('./API/dashboardRouter'));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});