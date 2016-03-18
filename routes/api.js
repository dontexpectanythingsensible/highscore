const express = require('express');
const router = express.Router();
const Score = require('../models/score');
const passport = require('passport');
const authController = require('../controllers/auth')(passport);

var bodyParser = require('body-parser');
var tokenAuth = require('../controllers/token');

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    // 401 = not logged in
    // 403 = logged in but don't have permission
    res.status(403);
    res.json({ message: 'Please log in' });
};

router.route('/')
    .get((req, res) => {
        Score.find().sort({ score: -1 }).exec((err, scores) => {
            if(err) {
                res.send(err);
            }

            res.json(scores);
        });
    })

    .post(isLoggedIn, (req, res) => {
        const score = new Score();
        score.user = req.body.user;
        score.score = req.body.score;
        score.life = req.body.life;
        score.created = new Date();
        score.visible = false;

        return score.save(err => {
            if(err) {
                res.send(err);
            }

            return res.json({ message: 'created!' });
        });
    });

router.route('/:score_id')
    .get((req, res) => {
        Score.findById(req.params.score_id, (err, score) => {
            if(err) {
                res.send(err);
            }

            res.json(score);
        });
    })

    .put([bodyParser(), tokenAuth], (req, res) => {
        if(req.user) {
            Score.findById(req.params.score_id, (err, score) => {
                if(err) {
                    res.send(err);
                }

                score.user = req.body.user || score.user;
                score.score = req.body.score || score.score;
                score.life = req.body.life || score.life;
                score.created = new Date() || score.created;
                score.visible = false || score.visible;

                score.save(err => {
                    if(err) {
                        res.send(err);
                    }

                    res.json(score);
                });
            });
        } else {
            res.status(403);
            res.json({ message: 'Please log in' });
        }
    })

    .delete(isLoggedIn, (req, res) => {
        Score.remove({
            _id: req.params.score_id
        }, (err, score) => {
            if(err) {
                res.send(err);
            }

            res.send('Deleted!');
        });
    });

module.exports = router;