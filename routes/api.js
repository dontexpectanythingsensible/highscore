const express = require('express');
const router = express.Router();
const Score = require('../models/score');
// const passport = require('passport');
// const authController = require('../controllers/auth')(passport);
// const secret = require('../config/session').secret;
// const jwt = require('jwt-simple');

// const bodyParser = require('body-parser');
const tokenAuth = require('../controllers/token');

router.use(tokenAuth);

router.route('/')
    .get((req, res) => {
        Score.find().sort({ score: -1 }).exec((err, scores) => {
            if(err) {
                res.send(err);
            }

            res.json(scores);
        });
    })

    .post((req, res) => {
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

            return res.json({
                success: true,
                message: 'created!'
            });
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

    .put((req, res) => {
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
            res.json({
                success: false,
                message: 'Please log in'
            });
        }
    })

    .delete((req, res) => {
        Score.remove({
            _id: req.params.score_id
        }, (err, score) => {
            if(err) {
                // res.send(err);
                res.json({
                    success: false,
                    message: 'Error deleting score'
                });
            }

            res.json({
                success: true,
                message: 'Deleted!'
            });
        });
    });

router.route('/user/:user_id')
    .get((req, res) => {
        Score.find({ user: req.params.user_id }, (err, scores) => {
            if(err) {
                res.send(err);
            }

            res.json(scores);
        });
    });

module.exports = router;