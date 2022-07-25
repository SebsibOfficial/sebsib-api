const express = require('express');
const dotenv = require('dotenv');
const {postRoutes, getRoutes, patchRoutes, authRoutes, adminRoutes, deleteRoutes} = require('./routes');
const bodyParser = require('body-parser');
const authorizeKey = require('./utils/authorizeKey');
const authorizeToken = require('./utils/authorizeToken');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const app = express(); // Start the Server
dotenv.config(); // Configure to access .env files
mongoose.connect(process.env.NODE_ENV == 'dev' ? process.env.TEST_DB_URL : process.env.PROD_DB_URL)
.catch(error => console.error(error))
.then(() => app.listen(3000, () => console.log("Server Running at 3000..."))) // Connect to the Database

app.use(limiter); // Limit requests
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
