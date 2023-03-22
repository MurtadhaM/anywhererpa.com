let express = require("express");
config = require("./config");
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
var logger = require('morgan');
const cors = require('cors')
let bodyParser = require("body-parser");
let userRouter = require('./routes/userRouter');
let documentsRouter = require('./routes/documentsRouter');
let path = require("path");
const PORT = config.PORT;

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
let app = express();
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

app.use('/documents', checkAuth);
// Routes
app.use('/api/users', userRouter);
app.use('/api/documents', documentsRouter);


// Server
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});

console.log('API is running on port 3000');