var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var config = require('../config/config');
var auth = jwt({
    secret: config.secretKey,
    userProperty: 'payload'
});

var authentication = require('../controllers/auth');
var users = require('../controllers/user');

router.post('/register', authentication.register);
router.post('/login', authentication.login);
router.post('/edit', auth, authentication.edit);
router.post('/change_password', auth, authentication.changePassword);

router.get('/get_user/:id', users.getUser);
router.get('/get_users', users.getUsers);

router.post('/validate', auth, authentication.validateToken);

module.exports = router;
