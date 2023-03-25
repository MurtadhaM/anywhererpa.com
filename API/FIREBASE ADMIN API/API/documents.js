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
const cookieParser = require('cookie-parser');
const path = require('path');
const upload = require('../middlewares/upload');




router.get('/', async(req, res) => {
    const documents = await Document.find();
    res.json(documents);
});
router.get('/:id', async(req, res) => {

    const document = await Document.findById(req.params.id);
    res.json(document);
});
router.post('/', async(req, res) => {
        /**
         * Link document to user from Session
         */
        req.body.user = req.session.user._id;
        const document = new Document(req.body);
        await document.save();
        res.json({
            status: 'Document saved'
        });
    }

);
router.delete('/:id', async(req, res) => {
    await Document.findByIdAndRemove(req.params.id);
    res.json({
        status: 'Document deleted'
    });
});

router.put('/:id', async(req, res) => {

    /**
     * Link document to user from Session
     */
    req.body.user = req.session.user._id;
    await Document.findByIdAndUpdate(req.params.id, req.body);
    res.json({
        status: 'Document updated'
    });
});

/**
 * Search documents by User
 */
router.get('/user/:id', async(req, res) => {
    const documents = await Document.find({ uid: req.params.id });
    res.json(documents);
});

/**
 * Search documents by User Email
 * */
router.get('/user/email/:email', async(req, res) => {
        const documents = await Document.find({ email: req.params.email });
        res.json(documents);
    }

)


module.exports = router;