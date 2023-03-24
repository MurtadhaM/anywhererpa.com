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


const mainRouter = require('./routes/mainRouter').mainRouter;
let checkAuth = require('./middlewares/auth').checkAuth;
let userRouter = require('./routes/userRouter');
let documentsRouter = require('./routes/documentsRouter');





const app = express();


/**
 * FLASH MESSAGES MIDDLEWARE FOR ALL ROUTES
 */
// app.use((req, res, next) => {


//     res.locals.user = req.session.user; 
//     res.locals.role = req.session.role || 'user';


//     next();
// });


// /**
//  * FLASH ERROR MESSAGES
//  */
// app.use((req, res, next) => {

//     console.log(res.locals.flashMessages);
//     next();
// });

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




// /**
//  * CSRF TOKEN
//  * */
// app.use(csrfProtection);

// app.all("*", (req, res, next) => {
//     res.cookie("XSRF-TOKEN", req.csrfToken({ httpOnly: true, secure: true, sameSite: 'none', path: '/', sameSite: false }));
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



app.use('/api/users', require('./API/users'));
app.use('/api/documents', require('./API/documents'));


// Server
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});

console.log('API is running on port 3000');