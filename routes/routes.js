const express = require('express');

const router = express.Router()

module.exports = router;

//Get all Method
router.get('/getAll', (req, res) => {
    res.send('Get All Solicitudes')
})

//Get by ID Method
router.get('/getOne/:id', (req, res) => {
    res.send(req.params.id)
})
