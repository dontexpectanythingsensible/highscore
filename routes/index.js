var express = require('express');
var moment = require('moment');
var jwt = require('jwt-simple');
var secret = require('../config/session').secret;
var bodyParser = require('body-parser');
var tokenAuth = require('../controllers/token');

module.exports = function(app, passport) {
    /* GET home page. */
    app.get('/', function(req, res) {
        res.render('home', {
            title: 'High Scores',
            user: req.user,
            message: req.flash('message')
        });
    });
    app.post('/', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/signup', function(req, res) {
        res.render('signup', { message: req.flash('message') });
    });
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    }));


    // token ---------------------------
    app.post('/token', function(req, res, next) {

        passport.authenticate('local-login', function(err, user, info) {
            if(err) {
                return next(err);
            }
            if(!user) {
                return res.json(401, { error: 'User not found' });
            }

            var expires = moment().add(7, 'day').valueOf();
            var token = jwt.encode({
                iss: user._id,
                exp: expires
            }, secret);

            res.json(token);
        })(req, res, next);
    });
    app.get('/tokentest', [bodyParser(), tokenAuth], function(req, res, next) {
        if(req.user) {
            res.json(req.user);
        }
        res.end('nope');
    });

}
