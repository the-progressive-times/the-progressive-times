var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.checkToken = function (req, res, successCallback, failureCallback) {
    var auth = req.get('authorization').split(' ')[1];

    jwt.verify(auth, config.secretKey, function (err, decoded) {
        if (err) {
            if (failureCallback) {
                failureCallback();
            } else {
                sendJSONResponse(res, 401, {
                    message: 'Authentication failed. Try again.'
                })
            }
        } else {
            User.findById(decoded._id, function (err, user) {
                if (err) {
                    if (failureCallback) {
                        failureCallback();
                    } else {
                        sendJSONResponse(res, 401, {
                            message: 'Authentication failed. Try again.'
                        })
                    }
                } else {
                    if (user && user.hash == req.payload.hash) {
                        successCallback(user);
                    } else {
                        if (failureCallback) {
                            failureCallback();
                        } else {
                            sendJSONResponse(res, 401, {
                                message: 'Authentication failed. Try again.'
                            })
                        }
                    }
                }
            })
        }
    })
};

module.exports.checkRank = function (req, res, requiredRank, callback) {
    this.checkToken(req, res, function (user) {
        if (user.rank >= requiredRank) {
            callback(user);
        } else {
            sendJSONResponse(res, 401, {
                message: 'You are not permitted to perform that action.'
            });
        }
    });
};
