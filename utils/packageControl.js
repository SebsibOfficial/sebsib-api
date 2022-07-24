const jwt = require('jsonwebtoken');
const verifyPackage = require('./verifyPackage')
const getToken = require('../utils/getToken')
// Middleware to check the packages the organizations have.

module.exports = packageControl = (check) => {
  return packageControl[check] || (packageControl[check] = async function(req, res, next) {
    var result = await verifyPackage(getToken(req.header('Authorization')), check);
    if (result === true) {
      next();
    }
    else return res.status(401).json({message: "Package is "+result});
  })}