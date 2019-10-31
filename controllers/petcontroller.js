const router = require('express').Router();
const Pet = require('../db').import('../models/pet');
const validateSession = require('../middleware/validate-session');

//Get All Results
router.get('/', (req, res) => {
    Pet.findAll()
    .then(pet => res.status(200).json(pet))
    .catch(err => res.status(500).json({ error: err }))
})

//Create Pet
router.post('/create', validateSession, (req, res) => {
    const petFromRequest = {
        nameOfPet: req.body.nameOfPet,
        typeOfPet: req.body.typeOfPet,
        breedOfPet: req.body.breedOfPet,
        ageOfPet: req.body.ageOfPet,
        genderOfPet: req.body.genderOfPet,
        ownerOfPet: req.body.ownerOfPet
}
    Pet.create(petFromRequest)
    .then(pet => res.status(200).json(pet))
    .catch(err => res.status(505).json(err.message))

})

//Find Single Pet by Name
router.get('/:name', (req, res) => {
    Pet.findOne({ where: { nameOfPet: req.params.name}})
    .then(pet => res.status(200).json(pet))
    .catch(err => res.status(500).json({ error: err }))
})

//Edit/Update Info about Pet
router.put('/:id', (req, res) => {
    Pet.update(req.body, { where: {id: req.params.id }})
    .then(pet => res.status(200).json(pet))
    .catch(err => res.json({ error: err }))
})

//Delete Pet
router.delete('/:id', (req, res) => {
    Pet.destroy({ where: { id: req.params.id }})
    .then(pet => res.status(200).json(pet))
    .catch(err => res.status(500).json({ error: err }))
})

module.exports = router;