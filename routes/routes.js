const express = require('express');
const Model = require('../models/model');

const router = express.Router()

module.exports = router;

//Get all Method
/* router.get('/getAll', (req, res) => {
    res.send('Get All Solicitudes')
}) */
router.get('/getAll', async (req, res) => {
    try{
        const solicitud = await Model.find();
        res.json(solicitud)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get('/getAllTest', async (req, res) => {
    try{
        const solicitud = await Model.find( { asunto: "21-02-EP-J29" } );
        res.json(solicitud)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by ID Method
router.get('/getOne/:id', (req, res) => {
    res.send(req.params.id)
})
