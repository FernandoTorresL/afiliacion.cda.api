require('dotenv').config();

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

app.use(express.json());

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})

