var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var validate = require('../utilities/validate');
var authenticate = require('../utilities/authenticate');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.register = function (req, res) {
    if (!req.body.username || !req.body.email || !req.body.password) {
        sendJSONResponse(res, 400, {
            message: 'All fields required'
        });
    } else {
        User.findOne({'email': req.body.email}, function (err, userInfo) {
            if (userInfo) {
                res.status(400);
                res.json({message: 'Email already registered'});
            } else {
                User.findOne({'username': req.body.username}, function (err, userInfo) {
                    if (userInfo) {
                        res.status(400);
                        res.json({message: 'Username already registered'});
                    } else {
                        var validation = validate.validate([
                            {
                                value: req.body.username,
                                checks: {
                                    required: true,
                                    minlength: 3,
                                    maxlength: 18,
                                    regex: /^[a-zA-Z0-9_-]*$/
                                }
                            },
                            {
                                value: req.body.fullname,
                                checks: {
                                    required: true,
                                    minlength: 3,
                                    maxlength: 50
                                }
                            },
                            {
                                value: req.body.email,
                                checks: {
                                    required: true,
                                    minlength: 3,
                                    maxlength: 100,
                                    regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                                }
                            },
                            {
                                value: req.body.password,
                                checks: {
                                    required: true,
                                    matches: req.body.confirm,
                                    minlength: 8,
                                    maxlength: 40
                                }
                            }
                        ]);

                        if (validation.passed) {
                            var user = new User();
                            user.username = req.body.username;
                            user.fullname = req.body.fullname;
                            user.email = req.body.email;
                            user.rank = 1;
                            user.avatar = '';
                            user.setPassword(req.body.password);

                            user.save(function (err) {
                                var token;
                                token = user.generateJwt();
                                res.status(200);
                                res.json({
                                    token: token
                                });
                            });
                        } else {
                            sendJSONResponse(res, 401, {
                                message: 'Invalid input. Please don\'t mess with Angular\'s form validation.'
                            });

                            console.dir(validation.errors);
                        }
                    }
                });
            }
        });
    }
};

module.exports.login = function (req, res) {
    if (!req.body.email || !req.body.password) {
        sendJSONResponse(res, 400, {
            message: 'All fields required'
        });
    } else {
        passport.authenticate('local', function (err, user, info) {
            var token;
            if (err) {
                sendJSONResponse(res, 404, {
                    message: 'Error!'
                });
            } else if (user) {
                token = user.generateJwt();
                sendJSONResponse(res, 200, {
                    token: token
                });
            } else {
                res.status(401).json(info);
            }
        })(req, res);
    }
};

module.exports.edit = function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (user && user._id != req.payload._id) {
            sendJSONResponse(res, 418, {
                message: 'Email already exists!'
            })
        } else {
            User.findOne({
                username: req.body.username
            }, function (err, user) {
                if (user && user._id != req.payload._id) {
                    sendJSONResponse(res, 418, {
                        message: 'Username already exists!'
                    })
                } else {
                    var validation = validate.validate([
                        {
                            value: req.body.username,
                            checks: {
                                required: true,
                                minlength: 3,
                                maxlength: 18,
                                regex: /^[a-zA-Z0-9_]*$/
                            }
                        },
                        {
                            value: req.body.fullname,
                            checks: {
                                required: true,
                                minlength: 3,
                                maxlength: 50
                            }
                        },
                        {
                            value: req.body.email,
                            checks: {
                                required: true,
                                minlength: 3,
                                maxlength: 100,
                                regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                            }
                        }
                    ]);

                    authenticate.checkToken(req, res, function (user) {
                        if (validation.passed) {
                            User.findByIdAndUpdate(req.payload._id, {
                                $set: {
                                    email: req.body.email,
                                    username: req.body.username,
                                    fullname: req.body.fullname
                                }
                            }, {
                                new: true
                            }, function (err, user) {
                                sendJSONResponse(res, 200, {
                                    message: 'You have successfully edited your profile.',
                                    token: user.generateJwt()
                                })
                            })
                        } else {
                            sendJSONResponse(res, 400, {
                                message: 'Invalid input. Please don\'t mess with Angular\'s form validation.'
                            });

                            console.dir(validation.errors);
                        }
                    })
                }
            })
        }
    })
};

module.exports.changePassword = function (req, res) {
    var validation = validate.validate([
        {
            value: req.body.confirm,
            checks: {
                required: true
            }
        },
        {
            value: req.body.password,
            checks: {
                required: true,
                matches: req.body.confirm,
                minlength: 8,
                maxlength: 40
            }
        }
    ]);

    if (validation.passed) {
        User.findById(req.payload._id, function (err, user) {
            if (user.checkPassword(req.body.current)) {
                if (err) {
                    sendJSONResponse(res, 500, {
                        message: 'Unexpected error.'
                    })
                } else if (user) {
                    authenticate.checkToken(req, res, function (user) {
                        user.setPassword(req.body.password);
                        user.save(function (err, user) {
                            sendJSONResponse(res, 200, {
                                message: 'You have successfully changed your password.'
                            })
                        });
                    })

                } else {
                    sendJSONResponse(res, 401, {
                        message: 'Unauthorized'
                    })
                }
            } else {
                sendJSONResponse(res, 401, {
                    message: 'You have provided a bad password.'
                })
            }
        })
    }
};

module.exports.validateToken = function (req, res) {
    authenticate.checkToken(req, res, function (user) {
        sendJSONResponse(res, 200, {
            message: 'Your token is valid.'
        })
    })
};
