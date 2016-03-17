const express = require('express');
const router = express.Router();
const Score = require('../models/score');

router.route('/')
    .get((req, res) => {
        Score.find((err, scores) => {
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

    .put((req, res) => {
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
    })

    .delete((req, res) => {
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