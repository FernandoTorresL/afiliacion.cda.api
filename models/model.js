const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema({
    sujeto: {
        required: true,
        type: String
    },
    operacion: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('solicitude', solicitudSchema)

