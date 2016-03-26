var User = require('../models/user');
var jwt = require('jwt-simple');
var secret = require('../config/session').secret;

module.exports = function(req, res, next) {
    const token = req.body.access_token ||
        req.query.access_token ||
        req.headers['x-access-token'];

    if(token) {
        try {
            var decoded = jwt.decode(token, secret);
            if(decoded.exp <= Date.now()) {
                // res.end('Access token has expired', 400);
                return res.status(403).send({
                    success: false,
                    message: 'Token expired'
                });
            }

            console.log(decoded);

            User.findOne({ _id: decoded.iss }, function(err, user) {
                if(err) {
                    console.log(err);
                    return res.status(403).send({
                        success: false,
                        message: 'Error authenticating token'
                    });
                }

                if(!user) {
                    return res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate token'
                    });
                }

                req.user = user;
                next();
            });
        } catch(err) {
            console.log(err);
            return res.status(403).send({
                success: false,
                message: 'Failed to authenticate token'
            });
        }

    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided'
        });
    }
};