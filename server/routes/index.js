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
var article = require('../controllers/article');

router.post('/register', authentication.register);
router.post('/admin_register', auth, authentication.adminRegister);
router.post('/login', authentication.login);
router.post('/edit', auth, authentication.edit);
router.post('/change_password', auth, authentication.changePassword);
router.post('/create_article', auth, article.create);
router.post('/edit_article/:id', auth, article.edit);

router.get('/get_articles', article.getAllArticles);
router.get('/get_article/:id', article.getArticle);
router.get('/get_user/:id', users.getUser);
router.get('/get_users', users.getUsers);
router.get('/get_logs/:id', article.getLogs);

router.post('/validate', auth, authentication.validateToken);

module.exports = router;
