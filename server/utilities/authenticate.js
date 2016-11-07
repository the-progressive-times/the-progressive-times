var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.checkToken = function (req, res, callback) {
    var auth = req.get('authorization').split(' ')[1];

    jwt.verify(auth, config.secretKey, function (err, decoded) {
        if (err) {
            sendJSONResponse(res, 401, {
                message: 'Your token is invalid.'
            })
        } else {
            User.findById(decoded._id, function (err, user) {
                if (err) {
                    sendJSONResponse(res, 401, {
                        message: 'Your token is invalid.'
                    })
                } else {
                    if (user && user.hash == req.payload.hash) {
                        callback(user);
                    } else {
                        sendJSONResponse(res, 401, {
                            message: 'Your token is invalid.'
                        })
                    }
                }
            })
        }
    })
};

module.exports.checkRank = function (req, res, requiredRank, callback) {
    this.checkToken(req, res, function (user) {
        if (user.rank === requiredRank) {
            callback(user);
        } else {
            sendJSONResponse(res, 401, {
                message: 'You are not permitted to perform that action.'
            });
        }
    });
};
