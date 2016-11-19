var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var config = require('../config/config');
var validate = require('../utilities/validate');
var authenticate = require('../utilities/authenticate');
var ranks = require('../config/user-ranks');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var emailCreds = require('../config/email-creds');

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.adminRegister = function (req, res) {
    authenticate.checkRank(req, res, ranks.ADMIN, function (admin) {
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
                                value: req.body.rank,
                                checks: {
                                    required: true,
                                    matches: ['1', '2', '3', '4']
                                }
                            }
                        ]);

                        if (validation.passed) {
                            var user = new User();
                            var tempPass = crypto.randomBytes(16).toString('hex');

                            user.username = req.body.username;
                            user.fullname = req.body.fullname;
                            user.email = req.body.email;
                            user.rank = req.body.rank;
                            user.avatar = '';
                            user.mustChangePass = true;
                            user.setPassword(tempPass);

                            user.save(function (err) {
                                var token;
                                token = user.generateJwt();
                                // Ask @jackson-y for the email-creds.js file
                                var transporter = nodemailer
                                    .createTransport('smtps://' + emailCreds.username + ':' + emailCreds.password + '@smtp.gmail.com');

                                //******IF YOU PLAN ON USING YOUR OWN SERVER:******

                                // var transporter = {
                                //     host: 'smtp.gmail.com',
                                //     port: 465,
                                //     secure: true, // use SSL
                                //     auth: {
                                //         user: 'user@gmail.com',
                                //         pass: 'pass'
                                //     }
                                // };

                                var mailOptions = {
                                    from: '"The Progressive Times" <info@progtimes.com>', // whatever address ya'll want to use
                                    to: req.body.email, // recipient email
                                    subject: 'Welcome to The Progressive Times, ' + req.body.fullname, // Subject line
                                    text: 'Your temporary password is: <b>' + tempPass + '</b>. ' +
                                    'When you log in, you will be required to change it.',
                                    html: 'Your temporary password is: <b>' + tempPass + '</b>. ' +
                                    'When you log in, you will be required to change it.'
                                };

                                // send mail with defined transport object
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        sendJSONResponse(res, 500, {
                                            message: 'Could not send the email.'
                                        })
                                    } else {
                                        res.status(200);
                                        res.json({
                                            token: token
                                        });
                                    }
                                    console.log('Message sent: ' + info.response);
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
    })
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
                                    maxlength: 100
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
                            user.mustChangePass = false;
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
                        }
                    ]);

                    authenticate.passwordChangeRequired(req, res, function (user) {
                        if (validation.passed) {
                            user.email = req.body.email;
                            user.username = req.body.username;
                            user.fullname = req.body.fullname;

                            user.save(function (err) {
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
                        user.mustChangePass = false;
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
