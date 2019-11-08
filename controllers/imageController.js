const router = require('express').Router();
const Image = require('../db').import('../models/image');
const multer = require('multer');
const path = require('path');
const validateSession = require('../middleware/validate-session');
const multerS3 = require ('multer-s3');
const fs = require('fs');
const AWS = require('aws-sdk');

var s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
});

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'am-image-db',
        metadata: function(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
})

//Post Image
router.post('/upload', validateSession, upload.single('image'), (req, res) => {
    Image.create({
        location: req.file.location,
        owner_id: req.user.id,
        posted_by: req.user.username
    })
        .then(successData => res.status(200).json({ successData }))
        .catch(err => {
            res.status(500).json({ error: err })
            console.log(err);
        })
});

//Get your Images
router.get('/mine', validateSession, (req, res) =>{
    Image.findAll({
        where: {
            owner_id: req.user.id
        },
        order: [
            ['id', 'DESC']
        ]
    })
        .then(
            findSuccess = data => {
                res.status(200).json({ userImages: data })
            },
            findError = err => {
                res.status(500).json({ error: err })
            }
        )
})

//Get All Images
router.get('/all', (req, res) => {
    Image.findAll({
        order: [
            ['id', 'DESC']
        ]
    })
        .then(images => {
            res.status(200).json({ images })
        })
        .catch(err => res.status(500).json({ error: err }));
})

//Get Image By ID
router.get('/:id', (req, res) => {
    Image.findOne({
        where: {
            id: req.params.id,
        }
    })
        .then(foundImage => {
            res.status(200).json(foundImage);
        })
        .catch(err => {
            res.status(500).json(err);
        })
})

//Update Image by ID
router.put('/:id', validateSession, upload.single('image'), (req, res) => {
    Image.update({
        location: req.file.location,
        likes: 0
    },
    {
        where: {
            owner_id: req.user.id,
            id: req.params.id
        }
    })
    .then(recordsChanged => {
        res.status(200).json( recordsChanged );
    })
    .catch(err => res.status(500).json({ error: err }));
});

//Delete Image by ID
router.delete('/:id', validateSession, (req, res) => {
    Image.destroy({
        where: {
            id: req.params.id,
            owner_id: req.user.id
        }
    })
        .then(recordsChanged => {
            res.status(200).json(recordsChanged)
        })
        .catch(err => {
            console.log(error);
            res.status(500).json({ error: err });
        });
});

//Update Likes
router.put('/up/:id', (req, res) => {
    Image.findOne({ where: { id: req.params.id }})
    .then(image => {
        let newLikes = image.likes + 1;
        Image.update({
            likes: newLikes
        },
        {
            where: {
                id: req.params.id
            }
        })
    })
    .then(updateData => res.status(200).send('Like Recorded'))
    .catch(err => res.status(500).json(err))
});

//Unlike Image
router.put('/down/:id', (req, res) => {
    let currentImage = Image.findOne({ where: { id: req.params.id }})
    .then(image => {
        let newLikes = image.likes - 1;
        newLikes < 0 ? newLikes = 0 : newLikes = newLikes;
        Image.update({
            likes: newlikes
        },
        {
            where: {
                id: req.params.id
            }
        })
    })
    .then(data => res.status(200).send('Like Recorded'))
    .catch( err => res.status(500).send(err))
});

module.exports = router;