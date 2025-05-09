const express = require('express');
const Model = require('../models/model');

const router = express.Router()

module.exports = router;

//Get all Method
router.get('/v1/getAll', async (req, res) => {
  try {
    const solicitud = await Model.aggregate([
      {
        $project: {
          operacion: "$operacion" ,
          atendido: 1
        }
      },
      {
        $group: {
          _id: { operacion: "$operacion", atendido: "$atendido" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.operacion": 1,
          "_id.atendido": 1
        }
      }
    ]);
    require('log-timestamp')
    console.log("TODOS")
    res.json(solicitud)
  }

  catch (error) {
    res.status(500).json({ message: error.message })
  }
})

//Get all Method Without Duplicate
router.get('/v1/getAllWD', async (req, res) => {
  try {
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

    require('log-timestamp')
    console.log("TODOS-SIN-DUPLICADOS")
    res.json(solicitud)
  }

  catch (error) {
    res.status(500).json({ message: error.message })
  }
})
