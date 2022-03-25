
// Middleware to check API keys

module.exports = authorizeKey = (req, res, next) => {
  if (req.get('X-API-KEY') != process.env.API_KEY){
    return res.status(401).json({message: "Access Denied"});
  }    
  next();
}