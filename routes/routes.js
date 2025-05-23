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


// Get COUNT atendidos/pendientes before a specific date
router.get('/v1/getAll/antes_de/:antes_de_fecha', async (req, res) => {
  try {

    let antes_de_fecha_str = req.params.antes_de_fecha + "T06:00:00.000Z";

    const fecha_consulta = new Date(antes_de_fecha_str);

    const solicitud = await Model.aggregate([
      {
        $match: {
          fecha: { $lt: fecha_consulta }
        }

      },
      {
        $project: {
          operacion: "$operacion",
          atendido: 1,
          fecha: 1
        }
      },
      {
        $group: {
          _id: { operacion: "$operacion", atendido: "$atendido" },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.operacion",  // Agrupar por "operacion"
          atendidos: {
            $sum: {
              $cond: [{ $eq: ["$_id.atendido", 1] }, "$count", 0] // Cambiado a 1
            }
          },
          no_atendidos: {
            $sum: {
              $cond: [{ $eq: ["$_id.atendido", 0] }, "$count", 0] // Cambiado a 0
            }
          }
        }
      },
      {
        $sort: {
          "_id": 1  // Ordenar por operacion
        }
      }
    ]);

    require('log-timestamp')
    console.log("CONTEO DE TODOS ANTES DE YYYY-MM-DD:", fecha_consulta)
    res.status(200).json(solicitud);
  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// Get COUNT atendidos/pendientes between dates
router.get('/v1/getAll/entre/:despues_de_fecha/:antes_de_fecha', async (req, res) => {
  try {

    let antes_de_fecha_str = req.params.antes_de_fecha + "T06:00:00.000Z";
    let despues_de_fecha_str = req.params.despues_de_fecha + "T06:00:00.000Z";

    const fecha_consulta1 = new Date(despues_de_fecha_str);
    const fecha_consulta2 = new Date(antes_de_fecha_str);

    const solicitud = await Model.aggregate([
      {
        $match: {
          fecha: { $gt: fecha_consulta1, $lt: fecha_consulta2 }
        }

      },
      {
        $project: {
          operacion: "$operacion",
          atendido: 1,
          fecha: 1
        }
      },
      {
        $group: {
          _id: { operacion: "$operacion", atendido: "$atendido" },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.operacion",  // Agrupar por "operacion"
          atendidos: {
            $sum: {
              $cond: [{ $eq: ["$_id.atendido", 1] }, "$count", 0] // Cambiado a 1
            }
          },
          no_atendidos: {
            $sum: {
              $cond: [{ $eq: ["$_id.atendido", 0] }, "$count", 0] // Cambiado a 0
            }
          }
        }
      },
      {
        $sort: {
          "_id": 1  // Ordenar por operacion
        }
      }
    ]);

    require('log-timestamp')
    console.log("CONTEO DE TODOS DESPUES DE YYYY-MM-DD:", fecha_consulta1, " Y ANTES DE", fecha_consulta2)
    res.status(200).json(solicitud);
  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get COUNT atendidos/pendientes before a specific date + Without Duplicate
router.get('/v1/getAllWD/antes_de/:antes_de_fecha', async (req, res) => {
  try {

    let antes_de_fecha_str = req.params.antes_de_fecha + "T06:00:00.000Z";
    const fecha_consulta = new Date(antes_de_fecha_str);

    const solicitud = await Model.aggregate([
    {
      $match: {
        fecha: { $lt: fecha_consulta }
      }
    },
    {
      $group: {
        _id: {
          operacion: "$operacion",
          atendido: "$atendido",
          asunto: "$asunto"
        },
        fecha: { $first: "$fecha" }  // puedes conservar campos relevantes
      }
    },
    {
      $group: {
        _id: {
          operacion: "$_id.operacion",
          atendido: "$_id.atendido"
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: "$_id.operacion",  // Agrupar por "operacion"
        atendidos: {
          $sum: {
            $cond: [{ $eq: ["$_id.atendido", 1] }, "$count", 0]
          }
        },
        no_atendidos: {
          $sum: {
            $cond: [{ $eq: ["$_id.atendido", 0] }, "$count", 0]
          }
        }
      }
    },
    {
      $sort: {
        "_id": 1  // Ordenar por operacion
      }
    }
  ]);

    require('log-timestamp')
    console.log("CONTEO DE TODOS ANTES DE YYYY-MM-DD:", fecha_consulta, "SIN DUPLICADOS")
    res.json(solicitud)
  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get COUNT atendidos/pendientes between specific dates + Without Duplicate
router.get('/v1/getAllWD/entre/:despues_de_fecha/:antes_de_fecha', async (req, res) => {
  try {
    let antes_de_fecha_str = req.params.antes_de_fecha + "T06:00:00.000Z";
    let despues_de_fecha_str = req.params.despues_de_fecha + "T06:00:00.000Z";

    const fecha_consulta1 = new Date(despues_de_fecha_str);
    const fecha_consulta2 = new Date(antes_de_fecha_str);

    const solicitud = await Model.aggregate([
    {
      $match: {
        fecha: { $gt: fecha_consulta1, $lt: fecha_consulta2 }
      }
    },
    {
      $group: {
        _id: {
          operacion: "$operacion",
          atendido: "$atendido",
          asunto: "$asunto"
        },
        fecha: { $first: "$fecha" }  // puedes conservar campos relevantes
      }
    },
    {
      $group: {
        _id: {
          operacion: "$_id.operacion",
          atendido: "$_id.atendido"
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: "$_id.operacion",  // Agrupar por "operacion"
        atendidos: {
          $sum: {
            $cond: [{ $eq: ["$_id.atendido", 1] }, "$count", 0]
          }
        },
        no_atendidos: {
          $sum: {
            $cond: [{ $eq: ["$_id.atendido", 0] }, "$count", 0]
          }
        }
      }
    },
    {
      $sort: {
        "_id": 1  // Ordenar por operacion
      }
    }
  ]);

    require('log-timestamp')
    console.log("CONTEO DE TODOS DESPUES DE YYYY-MM-DD:", fecha_consulta1, " Y ANTES DE", fecha_consulta2, "SIN DUPLICADOS")
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
    console.log("One x asunto:", asunto_str)
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

// Get all by one operation, one asunto
router.get('/v1/:operacion/asunto/:asunto', async (req, res) => {
  try {

    let operacion_str = req.params.operacion;
    let asunto_str = req.params.asunto;

    const solicitud = await Model.find(
      {
        "operacion": {
          "$regex": operacion_str,
          "$options": "i"
        },
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
    console.log("OPERATION:", operacion_str, "| ASUNTO:", asunto_str)
    res.status(200).json(solicitud);
  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }
})



// Get all detailson MOD40 and delegation (atendido = 0), before a date
router.get('/v1/:operacion/delegacion/:delegacion/entre/:despues_de_fecha/:antes_de_fecha', async (req, res) => {
  try {

    let operacion_str = req.params.operacion;
    let delegacion_str = req.params.delegacion;
    let antes_de_fecha_str = req.params.antes_de_fecha + "T06:00:00.000Z";
    let despues_de_fecha_str = req.params.despues_de_fecha + "T06:00:00.000Z";

    const fecha_consulta1 = new Date(despues_de_fecha_str);
    const fecha_consulta2 = new Date(antes_de_fecha_str);

    const solicitud = await Model.find(
      {
        "operacion": {
          "$regex": operacion_str,
          "$options": "i"
        },
        atendido: 0,
        delegacion: delegacion_str,
        fecha: {
          $gt: fecha_consulta1,
          $lt: fecha_consulta2
        }
      }
    ).sort(
      {
        fecha: 1,
        subdelegacion: 1,
        asunto: 1
      }
    );

    require('log-timestamp')
    console.log("OPERATION", operacion_str, "| DEL", delegacion_str, "| DESPUES DE", fecha_consulta1, " Y ANTES DE", fecha_consulta2)
    res.status(200).json(solicitud);
  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }
})


//Get All Before a Date. All received before the date on fecha_consulta
router.get('/v1/getAllBeforeADate', async (req, res) => {
  try {
    const fecha_consulta = new Date("2025-05-12T06:00:00.000Z");

    const solicitud = await Model.aggregate([
      {  
        $match: {
          fecha: { $lt: fecha_consulta }
        }

      },
      {
        $project: {
          operacion: "$operacion",
          atendido: 1,
          fecha: 1
        }
      },
      {
        $group: {
          _id: { operacion: "$operacion", atendido: "$atendido" },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.operacion",  // Agrupar por "operacion"
          atendidos: {
            $sum: {
              $cond: [{ $eq: ["$_id.atendido", 1] }, "$count", 0] // Cambiado a 1
            }
          },
          no_atendidos: {
            $sum: {
              $cond: [{ $eq: ["$_id.atendido", 0] }, "$count", 0] // Cambiado a 0
            }
          }
        }
      },
      {
        $sort: {
          "_id": 1  // Ordenar por operacion
        }
      }
    ]);

    require('log-timestamp')
    console.log("TODOS - BEFORE SOME DATE")
    res.json(solicitud)
  }

  catch (error) {
    res.status(500).json({ message: error.message })
  }
})


//Get All Between some dates
router.get('/v1/getAllBetweenDates', async (req, res) => {
  try {
    const fecha_consulta1 = new Date("2025-04-01T06:00:00.000Z");
    const fecha_consulta2 = new Date("2025-05-01T06:00:00.000Z");

    const solicitud = await Model.aggregate([
      {  
        $match: {
          fecha: {
            $gte: fecha_consulta1,
            $lte: fecha_consulta2
          }
        }
      },
      {
        $project: {
          operacion: "$operacion",
          atendido: 1,
          fecha: 1
        }
      },
      {
        $group: {
          _id: { operacion: "$operacion", atendido: "$atendido" },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.operacion",  // Agrupar por "operacion"
          atendidos: {
            $sum: {
              $cond: [{ $eq: ["$_id.atendido", 1] }, "$count", 0] // Cambiado a 1
            }
          },
          no_atendidos: {
            $sum: {
              $cond: [{ $eq: ["$_id.atendido", 0] }, "$count", 0] // Cambiado a 0
            }
          }
        }
      },
      {
        $sort: {
          "_id": 1  // Ordenar por operacion
        }
      }
    ]);

    require('log-timestamp')
    console.log("TODOS - BETWEEN SOME DATES")

    res.json(solicitud)
  }

  catch (error) {
    res.status(500).json({ message: error.message })
  }
})
