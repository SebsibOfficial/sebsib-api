const express = require('express');
const dotenv = require('dotenv');
const {postRoutes, getRoutes, patchRoutes, authRoutes, adminRoutes, deleteRoutes} = require('./routes');
const bodyParser = require('body-parser');
const authorizeKey = require('./utils/authorizeKey');
const authorizeToken = require('./utils/authorizeToken');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express(); // Start the Server
dotenv.config(); // Configure to access .env files
mongoose.connect(process.env.NODE_ENV == 'dev' ? process.env.TEST_DB_URL : process.env.PROD_DB_URL)
.catch(error => console.error(error))
.then(() => app.listen(process.env.PORT, () => console.log("Server Running at "+process.env.PORT+"..."))) // Connect to the Database
app.use(cors()); // Enable CORS
app.use(authorizeKey); // Verify API Key in header
app.use(bodyParser.json()); // Parsing JSON body

// Main routes
app.use('/get', authorizeToken, getRoutes);
app.use('/post', authorizeToken, postRoutes);
app.use('/delete', authorizeToken, deleteRoutes);
app.use('/patch', authorizeToken, patchRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
