const express = require('express');
const dotenv = require('dotenv');
const {postRoutes, getRoutes, patchRoutes, authRoutes} = require('./routes');

const app = express();
dotenv.config();

// Verify API Key in header
app.use((req, res, next) => {
  if (req.get('X-API-KEY') != process.env.API_KEY){
    res.json({message: "Access Denied"});
  }    
  next();
})

app.use('/get', getRoutes);

app.use('/post', postRoutes);

app.use('/patch', patchRoutes);

app.use('/auth', authRoutes);



app.listen(process.env.PORT, () => console.log("Server Running at "+process.env.PORT+"..."))