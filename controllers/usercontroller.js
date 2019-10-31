const router = require('express').Router();
const User = require('../db').import('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res) => {
    User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    })
    .then(
        createSuccess = (user) => {
            let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60*60*24 })
            res.json({
                user: user,
                message: ' Profile was successfully created. ',
                sessionToken: token
            })
        },
        createError = err => res.send(500, err)
    )
})

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(user => {
        if(user) {
            bcrypt.compare(req.body.password, user.password, (err, matches) => {
                if(matches){
                    let token = jwt.sign({ id: user.id}, process.env.JWT_SECRET, { expiresIn: 60*60*24})
                    res.json({
                        user: user,
                        message: 'User Has Successfully Logged In!',
                        sessionToken: token
                    })
                } else {
                    res.status(502).send({ error: 'User Has Failed To Log In, Please Check Username Or Password.' })
                }
            })
        } else {
            res.status(500).send({ error: 'Failed to authenticate'})
        }
    }, err => res.status(501).send({ error: 'Failed to process'}))
})

module.exports = router;