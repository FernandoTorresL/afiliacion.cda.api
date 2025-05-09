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
          operacion: "$operacion",
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

// Get an specific record by asunto
router.get('/v1/asunto/:asunto', async (req, res) => {
  try {

    let asunto_str = req.params.asunto;

    const solicitud = await Model.find(
      {
        "asunto": {
          "$regex": asunto_str,
          "$options": "i"
        }
      }
    ).sort(
      {
        "fecha": 1
      }
    );

    require('log-timestamp')
    console.log("One x asunto: ", asunto_str)
    res.status(200).json(solicitud);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
})

// Get all by one operation, atendido = 1
router.get('/v1/:operacion/atendidos', async (req, res) => {
  try {

    let operacion_str = req.params.operacion;

    const solicitud = await Model.find(
      {
        "operacion": {
          "$regex": operacion_str,
          "$options": "i"
        },
        "atendido": 1
      }
    ).sort(
      {
        "asunto": 1,
        "fecha": 1
      }
    );

    require('log-timestamp')
    console.log(operacion_str, "-atendidos")
    res.status(200).json(solicitud);
  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all by one operation, atendido = 0
router.get('/v1/:operacion/pendientes', async (req, res) => {
  try {

    let operacion_str = req.params.operacion;

    const solicitud = await Model.find(
      {
        "operacion": {
          "$regex": operacion_str,
          "$options": "i"
        },
        "atendido": 0
      }
    ).sort(
      {
        "asunto": 1,
        "fecha": 1
      }
    );

    require('log-timestamp')
    console.log(operacion_str, "-pendientes")
    res.status(200).json(solicitud);
  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }
})
