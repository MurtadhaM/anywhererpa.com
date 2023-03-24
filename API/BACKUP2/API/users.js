const express = require('express');
const User = require('../models/user');
const MongoStore = require("connect-mongo");
const csrf = require('csurf');
const router = express.Router();
const config = require('../config');
const { checkAuth } = require('../middlewares/auth');
const { ObjectId } = require('mongodb');
const app = express();
const Document = require('../models/documents');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const upload = require('../middlewares/upload');




router.get('/', async(req, res) => {
    const users = await User.find();
    res.json(users);
});

router.get('/:id', async(req, res) => {

    const user = await User.findById(req.params.id);
    res.json(user);
})


router.post('/', async(req, res) => {
        const user = new User(req.body);
        await user.save();
        res.json({
            status: 'User saved'
        });
    }

);

router.delete('/:id', async(req, res) => {
    await User.findByIdAndRemove(req.params.id);
    res.json({
        status: 'User deleted'
    });
});

router.put('/:id', async(req, res) => {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.json({
        status: 'User updated'
    });
});

module.exports = router;