const jwt = require('jsonwebtoken');
const getToken = require('../utils/getToken')
// Middleware to check the jwt tokens

module.exports = authorizeToken = (req, res, next) => {
  const token = getToken(req.header('Authorization'));
  if (!token) return res.status(401).json({message: 'Access Denied'});

  try {
    // TODO Decrypt the AES here first
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
  } catch (error) {
    res.status(400).json({message: 'Invalid Token'});
  }
  next();
}
