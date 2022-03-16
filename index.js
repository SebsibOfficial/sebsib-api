const express = require('express');
const dotenv = require('dotenv');
const {postRoutes, getRoutes, patchRoutes, authRoutes} = require('./routes');
const bodyParser = require('body-parser');
const authorizeKey = require('./utils/authorizeKey');
const morganBody = require('morgan-body');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

const app = express(); // Start the Server
dotenv.config(); // Configure to access .env files
mongoose.connect(process.env.DB_URL).catch(error => console.error(error)) // Connect to the Database
app.use(authorizeKey); // Verify API Key in header
app.use(bodyParser.json()); // Parsing JSON body
morganBody(app, {noColors: true, stream: logger}); // Initialize logging each api request/response

// Main routes
app.use('/get', getRoutes);
app.use('/post', postRoutes);
app.use('/patch', patchRoutes);
app.use('/auth', authRoutes);

app.listen(process.env.PORT, () => console.log("Server Running at "+process.env.PORT+"..."))