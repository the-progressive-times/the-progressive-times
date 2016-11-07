var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Article = mongoose.model('Article');
var validate = require('../utilities/validate');
var authenticate = require('../utilities/authenticate');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.create = function (req, res) {
    authenticate.checkRank(req, res, 3, function (user) {
        var passed = validate.validate([
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

        if (passed) {
            var article = new Article();
            article.title = req.body.title;
            article.author = user._id;
            article.articleText = req.body.articleText;

            article.save(function (err) {
                if (err) {
                    console.log(err);
                    sendJSONResponse(res, 500, {
                        message: 'There was an unexpected error saving the article.'
                    });
                } else {
                    sendJSONResponse(res, 200, {
                        message: 'Success! The article was posted.'
                    })
                }
            });
        } else {
            sendJSONResponse(res, 400, {
                message: 'Invalid input'
            })
        }
    });
};
