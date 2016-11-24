var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Article = mongoose.model('Article');
var ArticleLog = mongoose.model('ArticleLog');
var validate = require('../utilities/validate');
var authenticate = require('../utilities/authenticate');
var ranks = require('../config/user-ranks');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.create = function (req, res) {
    authenticate.checkRank(req, res, ranks.MEMBER, function (user) {
        authenticate.passwordChangeRequired(req, res, function (user) {
            var validation = validate.validate([
                {
                    value: req.body.title,
                    checks: {
                        required: true,
                        minlength: 3,
                        maxlength: 100
                    }
                },
                {
                    value: req.body.articleText,
                    checks: {
                        required: true
                    }
                }
            ]);

            if (validation.passed) {
                var article = new Article();
                article.title = req.body.title;
                article.author = user._id;
                article.articleText = req.body.articleText;

                article.save(function (err, article) {
                    var creationLog = new ArticleLog();
                    creationLog.articleID = article._id;
                    creationLog.authorID = article.author;
                    creationLog.eventName = 'Created';

                    creationLog.save(function (err, article) {
                        if (err) {
                            console.log(err);
                            sendJSONResponse(res, 500, {
                                message: 'There was an unexpected error saving the article.'
                            });
                        } else {
                            sendJSONResponse(res, 200, {
                                message: 'Success! The article was posted.',
                                article: article
                            })
                        }
                    });
                });
            } else {
                sendJSONResponse(res, 400, {
                    message: 'Invalid input'
                });

                console.dir(validation.errors);
            }
        })
    });
};

module.exports.edit = function (req, res) {
    authenticate.checkRank(req, res, ranks.MEMBER, function (user) {
        authenticate.passwordChangeRequired(req, res, function (user) {
            var validation = validate.validate([
                {
                    value: req.body.title,
                    checks: {
                        required: true,
                        minlength: 3,
                        maxlength: 100
                    }
                },
                {
                    value: req.body.articleText,
                    checks: {
                        required: true
                    }
                }
            ]);

            if (validation.passed) {
                // TODO: Stop repeating myself
                Article.findById(req.params.id, function (err, article) {
                    if (String(article.author) === String(user._id)) {
                        Article.findOneAndUpdate(req.params.id, {
                            $set: {
                                title: req.body.title,
                                articleText: req.body.articleText
                            }
                        }, function (err, article) {
                            var articleLog = new ArticleLog();
                            articleLog.articleID = article._id;
                            articleLog.authorID = article.author;
                            articleLog.eventName = 'Modified By Author';

                            articleLog.save(function (err) {
                                sendJSONResponse(res, 200, {
                                    message: 'Successfully updated the article!'
                                })
                            });
                        });
                    } else {
                        authenticate.checkRank(req, res, ranks.EDITOR, function (user) {
                            Article.findOneAndUpdate(req.params.id, {
                                $set: {
                                    title: req.body.title,
                                    articleText: req.body.articleText
                                }
                            }, function (err, article) {
                                var articleLog = new ArticleLog();
                                articleLog.articleID = article._id;
                                articleLog.authorID = article.author;
                                articleLog.eventName = 'Modified By Staff';

                                articleLog.save(function (err) {
                                    sendJSONResponse(res, 200, {
                                        message: 'Successfully updated the article!',
                                        article: article
                                    })
                                });
                            })
                        })
                    }
                })
            }
        })
    })
};

module.exports.getArticle = function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        if (article) {
            console.log(article);
            console.log('yup');
            sendJSONResponse(res, 200, article);
        } else if (err) {
            sendJSONResponse(res, 500, {
                message: 'Internal server error.'
            })
        } else {
            sendJSONResponse(res, 404, {
                message: 'Article not found.'
            })
        }
    });
};

module.exports.getAllArticles = function (req, res) {
    Article.find(function (err, articles) {
        sendJSONResponse(res, 200, articles);
    })
};

module.exports.getLogs = function (req, res) {
    ArticleLog.find({articleID: req.params.id}).populate({path: 'authorID', select: 'username'}).exec(function (err, logs) {
        sendJSONResponse(res, 200, logs);
    });
};
