const express = require('express');
const dotenv = require('dotenv');
const {postRoutes, getRoutes, patchRoutes, authRoutes, adminRoutes, deleteRoutes, noAuthRoutes} = require('./routes');
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
if (process.env.NODE_ENV == 'dev' || process.env.NODE_ENV == 'test') {
	mongoose.connect(process.env.TEST_DB_URL)
	.catch(error => console.error(error))
	.then(() => app.listen(process.env.PORT, () => console.log("API @ "+process.env.PORT+" & DB @ "+process.env.TEST_DB_URL))) // Connect to the Database
} 
else {
	mongoose.connect(process.env.PROD_DB_URL, {
		authSource: "admin",
		user: process.env.DB_USER,
		pass: process.env.DB_PASS,
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.catch(error => console.error(error))
	.then(() => app.listen(process.env.PORT, () => console.log("API @ "+process.env.PORT+" & DB @ "+process.env.PROD_DB_URL))) // Connect to the Database
}
app.set('trust proxy', 1)
app.use(limiter); // Limit requests
app.use(cors()); // Enable CORS
if (process.env.NODE_ENV != 'test') // Only in Test mode
	app.use(authorizeKey); // Verify API Key in header
app.use(bodyParser.json()); // Parsing JSON body

// Main routes
app.use('/get', authorizeToken, getRoutes);
app.use('/post', authorizeToken, postRoutes);
app.use('/delete', authorizeToken, deleteRoutes);
app.use('/patch', authorizeToken, patchRoutes);
app.use('/noauth', noAuthRoutes);
app.use('/auth', authRoutes);
app.use('/admin', authorizeToken, adminRoutes);
