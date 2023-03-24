let express = require('express');
// Initialize Firebase
let config = require("../config");
let admin = config.admin;
let User = require('./../models/user');
let userRouter = express.Router();


userRouter.route('/').get(usersController.get);
userRouter.route('/find/:input').get(usersController.find);
userRouter.route('/add').post(usersController.add);
userRouter.route('/email').get(usersController.getByEmail);
userRouter.route('/:id')
    .get(usersController.getById)
    .put(usersController.update)
    .patch(usersController.patch)
    .delete(usersController.del);

userRouter.route('*').get((req, res) => {
    res.status(404).send('Not found');
});



module.exports = userRouter;