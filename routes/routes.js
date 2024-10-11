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
    console.log("TODOS")
    res.json(solicitud)
  }

  catch (error) {
    res.status(500).json({ message: error.message })
  }
})

//IVRO y TEC

//IVRO

router.get('/v1/IVRO/atendidos', async (req, res) => {
  try{
      const solicitud = await Model.find(
          {
            "operacion":  "IVRO",
            "atendido": 1
          }
        ).sort(
          {
            "asunto": 1,
            "fecha": 1
          }
        );
        console.log("IVRO-atendidos")
      res.status(200).json(solicitud);
    }
    catch(error){
      res.status(500).json({message: error.message})
  }
})

router.get('/v1/IVRO/pendientes', async (req, res) => {
  try{
      const solicitud = await Model.find(
          {
            "operacion":  "IVRO",
            "atendido": 0
          }
        ).sort(
          {
            "asunto": 1,
            "fecha": 1
          }
        );
        console.log("IVRO-pendientes")
      res.status(200).json(solicitud);
    }
    catch(error){
      res.status(500).json({message: error.message})
  }
})

router.get('/v1/IVRO/asunto/:asunto', async (req, res) => {
  try{
      let asunto_str = req.params.asunto;
      const solicitud = await Model.find(
          {
            "operacion": "IVRO",
            "asunto": asunto_str
          }
        ).sort(
          {
            "fecha": 1
          }
        );
        console.log("IVRO-xasunto")
      res.status(200).json(solicitud);
    }
    catch (error) {
    res.status(500).json({ message: error.message });
  }
})

// TEC

router.get('/v1/TEC/atendidos', async (req, res) => {
  try{
      const solicitud = await Model.find(
          {
            "operacion":  "TEC",
            "atendido": 1
          }
        ).sort(
          {
            "asunto": 1,
            "fecha": 1
          }
        );
        console.log("TEC-atendidos")
      res.status(200).json(solicitud);
    }
    catch(error){
      res.status(500).json({message: error.message})
  }
})

router.get('/v1/TEC/pendientes', async (req, res) => {
  try{
      const solicitud = await Model.find(
          {
            "operacion":  "TEC",
            "atendido": 0
          }
        ).sort(
          {
            "asunto": 1,
            "fecha": 1
          }
        );
        console.log("TEC-pendientes")
      res.status(200).json(solicitud);
    }
    catch(error){
      res.status(500).json({message: error.message})
  }
})

router.get('/v1/TEC/asunto/:asunto', async (req, res) => {
  try{
      let asunto_str = req.params.asunto;
      const solicitud = await Model.find(
          {
            "operacion": "TEC",
            "asunto": asunto_str
          }
        ).sort(
          {
            "fecha": 1
          }
        );
        console.log("TEC-xasunto")
      res.status(200).json(solicitud);
    }
    catch (error) {
    res.status(500).json({ message: error.message });
  }
})

//CDA07

router.get('/v1/CDA07/atendidos', async (req, res) => {
  try{
      const solicitud = await Model.find(
          {
            "operacion":  "CDA07",
            "atendido": 1
          }
        ).sort(
          {
            "asunto": 1,
            "fecha": 1
          }
        );
        console.log("CDA07-atendidos")
      res.status(200).json(solicitud);
    }
    catch(error){
      res.status(500).json({message: error.message})
  }
})

router.get('/v1/CDA07/pendientes', async (req, res) => {
  try{
      const solicitud = await Model.find(
          {
            "operacion":  "CDA07",
            "atendido": 0
          }
        ).sort(
          {
            "asunto": 1,
            "fecha": 1
          }
        );
        console.log("CDA07-pendientes")
      res.status(200).json(solicitud);
    }
    catch(error){
      res.status(500).json({message: error.message})
  }
})

router.get('/v1/CDA07/asunto/:asunto', async (req, res) => {
  try{
      let asunto_str = req.params.asunto;
      const solicitud = await Model.find(
          {
            "operacion": "CDA07",
            "asunto": asunto_str
          }
        ).sort(
          {
            "fecha": 1
          }
        );
        console.log("CDA07-xasunto")
      res.status(200).json(solicitud);
    }
    catch (error) {
    res.status(500).json({ message: error.message });
  }
})
