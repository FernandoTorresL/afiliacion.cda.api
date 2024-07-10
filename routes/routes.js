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
        const solicitud = await Model.aggregate([
            {
                $group: {
                    _id: "$asunto",
                    operacion: { $first: { $toLower: "$operacion" } },
                    atendido: { $first: "$atendido" }
                }
            },
            {
                $group: {
                    _id: {
                        operacion: "$operacion",
                        atendido: "$atendido"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    operacion: "$_id.operacion",
                    atendido: "$_id.atendido",
                    count: 1
                }
            },
            {
                $sort: {
                    operacion: 1, // Orden ascendente por operacion
                    atendido: 1   // Orden ascendente por atendido
                }
            }
        ]);

        res.json(solicitud)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get('/getAllTest', async (req, res) => {
    try{
        const solicitud = await Model.find( { asunto: "14-39-MOTIVO1-04816447728" } );
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
