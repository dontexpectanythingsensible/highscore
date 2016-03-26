const express = require('express');
const router = express.Router();
const User = require('../models/user');
const tokenAuth = require('../controllers/token');

router.use(tokenAuth);

/* GET users listing. */
router.get('/', function(req, res, next) {
    if(req.user.isAdmin) {
        User.find((err, users) => {
            if(err) {
                res.send(err);
            }

            res.json(users);
        });
    } else {
        res.status(403).send({
            success: false,
            message: 'Unauthorised'
        });
    }
});

module.exports = router;
