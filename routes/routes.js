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
      "$group": {
        "_id": {
          "operacion": "$operacion",
          "atendido": "$atendido"
        },
        "count": {
          "$sum": 1
        }
      }
    },
    {
      "$group": {
        "_id": "$_id.operacion",
        "atendido_0": {
          "$sum": {
            "$cond": [
              {
                "$eq": [
                  "$_id.atendido",
                  0
                ]
              },
              "$count",
              0
            ]
          }
        },
        "atendido_1": {
          "$sum": {
            "$cond": [
              {
                "$eq": [
                  "$_id.atendido",
                  1
                ]
              },
              "$count",
              0
            ]
          }
        }
      }
    },
    {
      "$sort": {
        "_id": 1
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
