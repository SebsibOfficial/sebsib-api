const jwt = require('jsonwebtoken');
const verifyPackage = require('./verifyPackage')

// Middleware to check the packages the organizations have.

module.exports = packageControl = (check) => {
  return packageControl[check] || (packageControl[check] = async function(req, res, next) {
    var hasEnough = await verifyPackage(req.header('auth-token'), check);
    if (hasEnough) {
      next();
    }
    else return res.status(401).json({message: "Package not enough"});
  })}