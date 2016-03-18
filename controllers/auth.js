'use strict';
// const BasicStrategy = require('passport-http').BasicStrategy;
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

module.exports = function(passport) {
    // persist login
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    // ---------------------------
    // local signup
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, username, password, done) => {
        process.nextTick(() => {
            User.findOne({ 'username': username }, (err, user) => {
                if(err) {
                    return done(err);
                }

                if(user) {
                    console.log('username taken!');
                    return done(null, false, req.flash('message', 'That user name is already taken'));
                }

                // if already logged in, link accounts
                if(req.user) {
                    let user = req.user;
                    user.password = user.generateHash(password);
                    user.username = username;
                    user.isAdmin = false;
                    user.save(err => {
                        if(err) {
                            throw err;
                        }
                        return done(null, user);
                    });
                } else {
                    const newUser = new User();
                    newUser.username = username;
                    newUser.password = newUser.generateHash(password);
                    newUser.isAdmin = false;
                    newUser.save(err => {
                        if(err) {
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    // =-=-=-=-=-=-=-=-=-=-=-=
    // Local login
    // =-=-=-=-=-=-=-=-=-=-=-=
    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, username, password, done) {
        process.nextTick(function() {
            User.findOne({ 'username': username }, function(err, user) {
                if(err) {
                    return done(err);
                }

                if(!user) {
                    return done(null, false, req.flash('message', 'No user found'));
                }

                if(!user.validPassword(password)) {
                    return done(null, false, req.flash('message', 'Wrong password'));
                }

                return done(null, user);
            });
        });
    }));
}