require('dotenv').config();

const routes = require('./routes/routes');
const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL

// Connect to DB
mongoose.connect(mongoString);
const database = mongoose.connection;

// Test connection
database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database connected!');
})

// Transfer the content of Express into constant app
const app = express();

// Parse incoming requests with JSON payloads
app.use(express.json());

// All our endpoints will start with '/sub'.
app.use('/api/afiliacion.cda', routes);

app.route('/')
    .get(function (req, res) {
        res.sendFile(process.cwd() + '/index.html');
    }
    );

// Listen on port defined on .env file or use 3001
const listener = app.listen(process.env.PORT || 3001, () => {
    console.log('App started and listening on port ' + listener.address().port)
})

