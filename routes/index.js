var express = require('express');
// var router = express.Router();

module.exports = function(app, passport) {
    /* GET home page. */
    app.get('/', function(req, res) {
        res.render('home', {
            title: 'High Scores',
            user: req.user,
            message: req.flash('message')
        });
    });

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

}

// login



